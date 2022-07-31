<?php
/**
 * Updates.php
 *
 * @author Koen Van den Wijngaert <koen@neok.be>
 */

namespace Fri3dCamp\Pwa;

class Updates {

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_type' ), 0 );
	}

	/**
	 * Register post type.
	 */
	public function register_type(): void {
		$labels = array(
			'name'          => _x( 'App updates', 'post type general name', 'fri3dcamp-pwa' ),
			'singular_name' => _x( 'Update', 'post type singular name', 'fri3dcamp-pwa' ),
		);

		add_filter(
			'excerpt_more',
			function( $more ) {
				return get_post()->post_type === 'update' ? '' : $more;
			}
		);

		$args = array(
			'labels'             => $labels,
			'description'        => '',
			'public'             => true,
			'publicly_queryable' => false,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'query_var'          => true,
			'rewrite'            => false,
			'capability_type'    => 'post',
			'has_archive'        => false,
			'hierarchical'       => false,
			'menu_position'      => 4,
			'show_in_rest'       => true,
			'menu_icon'          => 'dashicons-megaphone',
			'supports'           => array( 'title', 'excerpt', 'editor', 'thumbnail' ),
		);

		register_post_type( 'update', $args );
	}

}
