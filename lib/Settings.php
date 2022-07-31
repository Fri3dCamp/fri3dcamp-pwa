<?php
/**
 * Settings.php
 *
 * @author Koen Van den Wijngaert <koen@neok.be>
 * @package Fri3dCamp\Pwa
 */

namespace Fri3dCamp\Pwa;

/**
 * Class Settings
 */
class Settings {
	private const SETTINGS_PAGE = 'fri3d_pwa';

	/**
	 * Attach to WordPress hook system.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( static::class, 'addOptionsPage' ) );
		add_action( 'admin_init', array( static::class, 'init_options') );
		add_action( 'update_option_' . static::SETTINGS_PAGE, array( static::class, 'updateOptions' ), 10, 2 );
	}

	public static function init_options() {
		register_setting( static::SETTINGS_PAGE, static::SETTINGS_PAGE );

		static::add_settings_sections();
		// static::addSettingFields();
	}

	private static function add_settings_sections() {
		// Push notifications section
		add_settings_section(
			static::prefix( 'section_push' ),
			__( 'Push notifications', 'fri3dcamp-pwa' ),
			function ( $args ) {
				?>
				<p id="
				<?php
				echo esc_attr( $args['id'] );
				?>
				">
					<?php
					esc_html_e(
						'Manage the default push notification settings.',
						'fri3dcamp-pwa'
					);
					?>
				</p>
				<?php
			},
			static::SETTINGS_PAGE
		);
	}

	public static function prefix( $str ) {
		return sprintf( '%s_%s', static::SETTINGS_PAGE, $str );
	}

	public static function checkbox_field( $args ) {
		$checked = (bool) static::get_option($args['label_for'], false );
		?>
		<label>
			<input type="checkbox" id="
			<?php
			echo esc_attr( $args['label_for'] );
			?>
			" class="checkbox"
				   name="
				   <?php
					echo static::SETTINGS_PAGE;
					?>
				   [
				   <?php
					echo esc_attr( $args['label_for'] );
					?>
				   ]"
				   value="1"
				<?php
				echo checked( $checked );
				?>
			>
			<?php
			if ( ! empty( $args['description'] ) ) :
				?>
				<span>
					<?php
					echo esc_html( $args['description'] );
					?>
				</span>
				<?php
			endif;
			?>
		</label>
		<?php
	}

	public static function get_option( $option = null, $default = '' ) {
		$options = get_option( static::SETTINGS_PAGE );

		if ( isset( $options[ $option ] ) ) {
			return $option !== null ? $options[ $option ] : $options;
		}

		return $option !== null ? $default : $options;
	}

	public static function checkboxes_field( $args ) {
		$checkedItems = static::get_option($args['label_for'], array() );
		$required     = isset( $args['required'] ) ? (bool) $args['required'] : false;
		$options      = isset( $args['options'] ) && is_array( $args['options'] ) ? $args['options'] : array();

		if ( ! empty( $args['description'] ) ) :
			?>
			<p class="description" style="margin-bottom: 0.5rem">
				<?php
				echo esc_html( $args['description'] );
				?>
			</p>
			<?php
		endif;
		foreach ( $options as $key => $value ) :
			?>
			<label style="display: block;">
				<input type="checkbox" id="
				<?php
				echo esc_attr( $args['label_for'] . '_' . $key );
				?>
				" class="checkbox"
					   name="
					   <?php
						echo static::SETTINGS_PAGE;
						?>
					   [
					   <?php
						echo esc_attr( $args['label_for'] );
						?>
					   ][]"
					   value="
					   <?php
						echo $key;
						?>
					   "
					<?php
					echo checked( in_array( $key, $checkedItems, true ) );
					?>
				>
				<span>
					<?php
					echo esc_html( $value );
					?>
				</span>
			</label>
			<?php
		endforeach;
	}

	public static function textField( $args ) {
		$default     = empty( $args['default'] ) ? false : (bool) $args['default'];
		$value       = static::get_option($args['label_for'], $default );
		$placeholder = empty( $args['placeholder'] ) ? '' : $args['placeholder'];
		?>
		<input type="text" id="
		<?php
		echo esc_attr( $args['label_for'] );
		?>
		" class="regular-text"
			   name="
			   <?php
				echo static::SETTINGS_PAGE;
				?>
			   [
			   <?php
				echo esc_attr( $args['label_for'] );
				?>
			   ]"
			   value="
			   <?php
				echo esc_attr( $value );
				?>
			   "
			   placeholder="
			   <?php
				echo $placeholder;
				?>
			   "
		>
		<?php
		if ( ! empty( $args['description'] ) ) :
			?>
			<p class="description">
				<?php
				echo esc_html( $args['description'] );
				?>
			</p>
			<?php
		endif;
	}

	public static function addOptionsPage() {
		add_submenu_page(
			'tools.php',
			__( 'Progressive Web App Settings', 'fri3dcamp-pwa' ),
			__( 'PWA', 'fri3dcamp-pwa' ),
			'manage_options',
			static::SETTINGS_PAGE,
			array( static::class, 'displayOptionsPage' )
		);
	}

	public static function displayOptionsPage() {
		// check user capabilities
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		if ( isset( $_GET['settings-updated'] ) ) {
			// add settings saved message with the class of "updated"
			add_settings_error(
				static::prefix( 'messages' ),
				static::prefix( 'messages' ),
				__( 'Settings updated' ),
				'updated'
			);
		}

		if ( $_SERVER['REQUEST_METHOD'] === 'POST' && isset( $_POST['notification_title'] ) ) {
			PushNotifications::send_message(
				$_POST['notification_title'],
				$_POST['notification_body'],
				array( 'url' => $_POST['notification_url'] )
			);
			add_settings_error(
				static::prefix( 'messages' ),
				static::prefix( 'messages' ),
				__( 'Message sent!' ),
				'updated'
			);
		}

		// show error/update messages
		settings_errors( static::prefix( 'messages' ) );
		$subscriberCount = static::getSubscriberCount();
		?>
		<div class="wrap">
			<h1>
			<?php
				echo esc_html( get_admin_page_title() );
			?>
				</h1>
			<form action="" method="post">
				<div class="current-subscriptions">
					<h2>
					<?php
						echo __( 'Current subscriptions', 'library-staging' );
					?>
						</h2>
					<p>
						<?php
						echo sprintf(
							_n(
								'There is currently <strong>%d</strong> subscription.',
								'There are currently <strong>%d</strong> subscriptions.',
								$subscriberCount,
								'library-staging'
							),
							number_format_i18n( $subscriberCount )
						);
						?>
					</p>
					<p><a href="
					<?php
						echo admin_url( 'edit.php?post_type=' . PushNotifications::SUB_POST_TYPE );
					?>
						"
						  class="button button-secondary">
						  <?php
							echo __( 'View the list' );
							?>
							</a></p>
				</div>

				<h2>Send a notification</h2>
				<p>Use this form to send a custom notification to all of the subscribers.</p>
				<table class="form-table">

					<tbody>
					<tr>
						<th scope="row"><label for="notification_title">Notification title</label></th>
						<td><input name="notification_title" type="text" id="notification_title" value="Library"
								   class="regular-text"></td>
					</tr>
					<tr>
						<th scope="row"><label for="notification_body">Notification body</label></th>
						<td>
							<div class="textarea-wrap">
								<textarea
									placeholder="<?php
									echo __(
										'Vestibulum id magna justo. Orci varius natoque penatibus et magnis dis parturient montes.',
										'fri3dcamp-pwa'
									);
									?>" rows="4" class="regular-text"
									name="notification_body" id="notification_body"></textarea>
							</div>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="notification_url">Notification URL</label></th>
						<td>
							<input name="notification_url" type="url" id="notification_url"
								   value="<?= PushNotifications::add_utm_codes(get_home_url(null, '/'),
																			 'ManualMessage'); ?>" class="regular-text">
							<p class="description">
								<?= __('Add Google Analytics tracking using UTM-codes. Eg:',
									   'fri3dcamp-pwa'); ?>
								<example>
									<?= PushNotifications::add_utm_codes(get_home_url(null, '/'), 'TestCampaign'); ?>
								</example>
							</p>
						</td>
					</tr>
					</tbody>
				</table>
				<?php
				submit_button( 'Send' );
				?>
			</form>
		</div>
		<?php
	}

	private static function getSubscriberCount() {
		return count( PushNotifications::get_subscribers() );
	}
}
