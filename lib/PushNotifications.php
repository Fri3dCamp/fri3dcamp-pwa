<?php
/**
 * Fri3d Camp: PushNotifications.php
 *
 * @author Koen Van den Wijngaert <koen@neok.be>
 * @package Fri3dCamp\Pwa
 */

namespace Fri3dCamp\Pwa;

use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\VAPID;
use Minishlink\WebPush\WebPush;

/**
 * Class PushNotifications
 */
final class PushNotifications {

	private const KEYS_OPTION      = 'fri3d_pwa_push_keys';
	private const SUBSCRIBE_ACTION = 'subscribe';
	private const KEY_ACTION       = 'get_key';
	public const SUB_POST_TYPE     = 'push_subs';

	public const DEFAULT_ICON = 'http://localhost:8888/app/img/fri3dcamp_white.png';

	/**
	 * Push encryption keys.
	 *
	 * @var array|null Encryption keys for the push notifications.
	 */
	private static ?array $keys = null;

	/**
	 * Attach to WordPress hook system.
	 */
	public function __construct() {
		$subscribe_callback = array( self::class, 'handle_subscribe' );
		$get_key_callback   = array( self::class, 'handle_get_key' );

		add_action( 'init', array( self::class, 'register_data_structure' ) );
		add_action( 'add_meta_boxes', array( self::class, 'add_meta_boxes' ) );

		add_action( 'wp_ajax_' . self::SUBSCRIBE_ACTION, $subscribe_callback );
		add_action( 'wp_ajax_nopriv_' . self::SUBSCRIBE_ACTION, $subscribe_callback );

		add_action( 'wp_ajax_' . self::KEY_ACTION, $get_key_callback );
		add_action( 'wp_ajax_nopriv_' . self::KEY_ACTION, $get_key_callback );

		add_filter(
			'allowed_http_origins',
			function ( $origins ) {
				$origins[] = 'https://app.fri3d.be';
				$origins[] = 'http://localhost:8888';
				$origins[] = 'http://localhost:3000';

				return $origins;
			}
		);

		add_action(
			'transition_post_status',
			static function ( string $new_status, string $old_status, \WP_Post $post ) {
				if ( ( $old_status === $new_status ) || ( 'publish' !== $new_status ) ) {
					return;
				}

				$notification = self::get_notification( $post );

				if ( ! $notification ) {
					return;
				}

				self::send_message( $notification['title'], $notification['body'], $notification['options'] );
			},
			10,
			3
		);
	}

	/**
	 * Get notification data for a given post.
	 *
	 * @param \WP_Post $post the post to get the notification data for.
	 */
	private static function get_notification( \WP_Post $post ): ?array {
		if ( 'update' !== $post->post_type ) {
			return null;
		}

		$notification = array(
			'title'   => $post->post_title,
			'body'    => wp_strip_all_tags( $post->post_excerpt ),
			'options' => array(
				'url'        => 'update/' . $post->ID,
				'icon'       => self::DEFAULT_ICON,
				'show_image' => false,
				'image'      => null,
			),
		);

		if ( has_post_thumbnail( $post->ID ) ) {
			$notification['options']['show_image'] = true;
			$notification['options']['image']      = get_the_post_thumbnail_url( $post );
		}

		return $notification;
	}

	/**
	 * Helper method to add utm codes to an url.
	 *
	 * @param string      $url The URL to add the utm codes to.
	 * @param string      $campaign The campaign to add.
	 * @param string|null $source The source to add.
	 * @param string|null $medium The medium to add.
	 */
	public static function add_utm_codes( string $url, string $campaign, ?string $source = 'Notification', ?string $medium = 'Web-Push' ): string {
		return add_query_arg(
			array(
				'utm_campaign' => $campaign,
				'utm_source'   => $source,
				'utm_medium'   => $medium,
			),
			$url
		);
	}

	/**
	 * Send a message to all subscribers.
	 *
	 * @param string     $title The title of the message.
	 * @param string     $body The body of the message.
	 * @param array|null $options The options for the message.
	 *
	 * @throws \ErrorException If the push notifications failed to send.
	 */
	public static function send_message( string $title, string $body, ?array $options = array() ): void {
		$options = wp_parse_args(
			$options,
			array(
				'url'        => get_home_url(),
				'image'      => null,
				'show_image' => false,
				'icon'       => self::DEFAULT_ICON,
			)
		);

		$push = new WebPush(
			array(
				'VAPID' => array(
					'subject'    => get_home_url(),
					'publicKey'  => self::get_keys()['publicKey'],
					'privateKey' => self::get_keys()['privateKey'],
				),
			)
		);

		set_time_limit( 0 );

		$push_data = wp_json_encode(
			array(
				'title' => $title,
				'body'  => $body,
				'data'  => $options,
			)
		);

		foreach ( self::get_subscribers() as $subscriber ) {
			self::send_push( $subscriber, $push, $push_data );
		}

		// handle eventual errors here, and remove the subscription from your server if it is expired.
		foreach ( $push->flush() as $report ) {
			$endpoint = $report->getRequest()->getUri()->__toString();

			if ( $report->isSubscriptionExpired() ) {
				$subscriber = self::get_by_endpoint( $endpoint );
				if ( $subscriber instanceof \WP_Post ) {
					update_post_meta( $subscriber->ID, 'subscription_state', 'expired' );
				}
			}
		}
	}

	/**
	 * Get the keys for the push notifications (or create if non-existing).
	 *
	 * @throws \ErrorException If the keys could not be created.
	 */
	private static function get_keys(): ?array {
		if ( null === self::$keys ) {
			self::$keys = get_option( self::KEYS_OPTION, null );

			if ( ! self::$keys ) {
				self::$keys = self::create_keys();
				update_option( self::KEYS_OPTION, self::$keys );
			}
		}

		return self::$keys;
	}

	/**
	 * Create the keys for the push notifications.
	 *
	 * @throws \ErrorException If the keys could not be created.
	 */
	private static function create_keys(): array {
		return VAPID::createVapidKeys();
	}

	/**
	 * Get a list of push notification subscribers.
	 *
	 * @param string|null $state Subscription state to filter on, defaults to subscribed.
	 *
	 * @return \WP_Post[]
	 */
	public static function get_subscribers( ?string $state = 'subscribed' ): array {
		return get_posts(
			array(
				'post_type'  => self::SUB_POST_TYPE,
				'meta_key'   => 'subscription_state',
				'meta_value' => $state,
			)
		);
	}

	/**
	 * Send a push notification to a subscriber.
	 *
	 * @throws \ErrorException If the push could not be sent.
	 */
	private static function send_push( \WP_Post $subscriber, WebPush $web_push, string $push_data ): void {
		try {
			$subscription_data = json_decode(
				get_post_meta( $subscriber->ID, 'subscription_data', true ),
				true,
				512,
				JSON_THROW_ON_ERROR
			);
		} catch ( \JsonException $e ) {
			return;
		}
		$subscription = Subscription::create( $subscription_data );

		$web_push->sendNotification( $subscription, $push_data );
	}

	/**
	 * @return int|\WP_Post|null
	 */
	private static function get_by_endpoint( string $endpoint ): ?\WP_Post {
		$subscribers = get_posts(
			array(
				'post_type'  => self::SUB_POST_TYPE,
				'meta_key'   => 'subscription_endpoint',
				'meta_value' => $endpoint,
			)
		);

		if ( $subscribers && count( $subscribers ) === 1 ) {
			return array_pop( $subscribers );
		}

		return null;
	}

	/**
	 * Ajax handler to increase popularity of a singular post.
	 */
	public static function handle_subscribe() {
		ob_end_clean();

		self::set_headers();

		$input_json = file_get_contents( 'php://input' );
		try {
			$input_object = json_decode( $input_json, true, 512, JSON_THROW_ON_ERROR );
		} catch ( \JsonException $e ) {
			wp_send_json_error(
				array(
					'message' => 'Invalid JSON for subscription data',
				)
			);
		}

		$payload = isset( $input_object['payload'] ) ? $input_object['payload'] : null;

		if ( ! $payload || ! isset( $payload['endpoint'] ) ) {
			wp_send_json_error( array( 'message' => 'No endpoint given.' ), 400 );
		}

		$subscription_post_id = wp_insert_post(
			array(
				'post_type'   => self::SUB_POST_TYPE,
				'post_title'  => sha1( $payload['endpoint'] ),
				'post_status' => 'publish',
			)
		);

		if ( is_wp_error( $subscription_post_id ) ) {
			wp_send_json_error( array( 'message' => $subscription_post_id->get_error_message() ), 500 );
		}

		if ( 0 === $subscription_post_id ) {
			wp_send_json_error( array( 'message' => 'Could not add subscription' ), 500 );
		}

		update_post_meta( $subscription_post_id, 'subscription_endpoint', $payload['endpoint'] );
		update_post_meta( $subscription_post_id, 'subscription_data', wp_json_encode( $payload ) );
		update_post_meta( $subscription_post_id, 'subscription_state', 'subscribed' );
		update_post_meta(
			$subscription_post_id,
			'subscription_profile',
			wp_json_encode(
				array(
					'browser' => wp_kses( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ?? '' ), array() ),
					'referer' => wp_get_referer(),
				)
			)
		);

		wp_send_json( null, 201 );
	}

	/**
	 * Set headers for CORS.
	 */
	protected static function set_headers(): void {
		header( 'Access-Control-Allow-Headers: Content-Length, ETag, Last-Modified' );
		header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS, HEAD' );
	}

	/**
	 * Ajax handler to increase popularity of a singular post.
	 */
	public static function handle_get_key(): void {
		ob_end_clean();
		self::set_headers();

		$data = array( 'serverKey' => self::get_keys()['publicKey'] );

		wp_send_json( $data, 200 );
	}

	/**
	 * Register subscription post type and related logic.
	 */
	public static function register_data_structure(): void {
		add_filter(
			'post_row_actions',
			static function ( $actions ) {
				if ( get_post_type() === self::SUB_POST_TYPE ) {
					unset( $actions['inline hide-if-no-js'] );
					if ( isset( $actions['edit'] ) ) {
						$actions['edit'] = str_replace( 'Edit', 'View', $actions['edit'] );
					}
				}

				return $actions;
			},
			10,
			1
		);

		add_filter(
			'manage_edit-' . self::SUB_POST_TYPE . '_columns',
			static function ( $columns ) {
				return wp_parse_args(
					$columns,
					array(
						'cb'                 => '',
						'title'              => '',
						'subscription_state' => __( 'State', 'fri3dcamp-pwa' ),
						'date'               => '',
					)
				);
			}
		);

		add_action(
			'manage_' . self::SUB_POST_TYPE . '_posts_custom_column',
			static function ( $column, $post_id ) {
				switch ( $column ) {
					case 'subscription_state':
						echo esc_html( strtoupper( get_post_meta( $post_id, 'subscription_state', true ) ) );
						break;
				}
			},
			10,
			2
		);

		$labels = array(
			'name'          => _x( 'Push subscriptions', 'post type general name', 'fri3dcamp-pwa' ),
			'singular_name' => _x( 'Subscription', 'post type singular name', 'fri3dcamp-pwa' ),
		);

		$args = array(
			'labels'             => $labels,
			'description'        => '',
			'public'             => false,
			'publicly_queryable' => false,
			'show_ui'            => true,
			'show_in_menu'       => false,
			'query_var'          => false,
			'rewrite'            => false,
			'capability_type'    => 'post',
			'has_archive'        => false,
			'hierarchical'       => false,
			'menu_position'      => null,
			'supports'           => array( 'title' ),
		);

		register_post_type( self::SUB_POST_TYPE, $args );
	}

	/**
	 * Show subscription meta boxes.
	 *
	 * @throws \JsonException If we fail to decode subscription JSON.
	 */
	public static function add_meta_boxes(): void {
		add_meta_box(
			'pwa_push_subscription',
			__( 'Subscription details', 'fri3dcamp-pwa' ),
			static function () {
				$post_id       = get_the_ID();
				$endpoint      = get_post_meta( $post_id, 'subscription_endpoint', true );
				$state         = get_post_meta( $post_id, 'subscription_state', true );
				$data          = wp_json_encode(
					json_decode( get_post_meta( $post_id, 'subscription_data', true ), false, 512, JSON_THROW_ON_ERROR ),
					JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR
				);
				$profile_items = json_decode( get_post_meta( $post_id, 'subscription_profile', true ), true );
				$profile_list  = sprintf(
					'<ul>%s</ul>',
					array_reduce(
						array_keys( $profile_items ),
						function ( $carry, $profile_item_key ) use ( $profile_items ) {
							$carry .= sprintf(
								'<li><strong>%s</strong>: %s</li>',
								esc_html( ucfirst( $profile_item_key ) ),
								esc_html( $profile_items[ $profile_item_key ] )
							);

							return $carry;
						},
						''
					)
				);
				?>
			<style>
				#pwa_push_subscription {
					margin-top: -20px;
				}

				#title, #major-publishing-actions {
					display: none;
				}

				.pushnot-table {
					max-width: 100%;
					table-layout: fixed;
				}

				.pushnot-table code {
					white-space: pre;
					padding: 7px;
					overflow: auto;
					border: 1px solid #ccc;
					display: block;
					max-width: 100%;
				}
			</style>
			<script>(function () {
					document.getElementById('title').setAttribute('readonly', 'readonly');
				})();</script>
			<table class="form-table pushnot-table">
				<tbody>
				<tr>
						<th><?php esc_html_e( 'Unique name', 'fri3dcamp-pwa' ); ?></th>
						<td><span class="subscription-title"><?php echo esc_html( get_the_title() ); ?></span></td>
				</tr>
				<tr>
						<th><?php esc_html_e( 'Push endpoint', 'fri3dcamp-pwa' ); ?></th>
						<td><code class="code"><?php echo esc_html( $endpoint ); ?></code></td>
				</tr>
				<tr>
						<th><?php esc_html_e( 'Subscription state', 'fri3dcamp-pwa' ); ?></th>
						<td><em><?php echo esc_html( strtoupper( $state ) ); ?></em></td>
				</tr>
				<tr>
						<th><?php esc_html_e( 'Raw data', 'fri3dcamp-pwa' ); ?></th>
						<td><code class="code"><?php echo esc_html( $data ); ?></code></td>
				</tr>
				<tr>
						<th><?php esc_html_e( 'Saved profile', 'fri3dcamp-pwa' ); ?></th>
						<td><?php echo esc_html( $profile_list ); ?></td>
				</tr>
				</tbody>
			</table>
					<?php
			},
			self::SUB_POST_TYPE,
			'advanced',
			'high'
		);
	}
}
