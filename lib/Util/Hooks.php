<?php
/**
 * Hooks.php
 *
 * @author Koen Van den Wijngaert <koen@neok.be>
 */

namespace Fri3dCamp\Pwa\Util;

use function in_array;

class Hooks {

	public function __construct() {
		add_action( 'after_setup_theme', array( $this, 'hooks' ) );
	}

	public function hooks() {
		add_action(
			'pre_get_posts',
			function ( \WP_Query $query ) {
				if ( ! isset( $query->query_vars['post_type'] ) ) {
					return;
				}

				if ( is_admin() ) {
					return;
				}

				if ( ! in_array(
					'programmapunten',
					(array) $query->query_vars['post_type'],
					true
				) || -1 !== (int) $query->query_vars['posts_per_page'] ) {
					return;
				}

				if ( $query->tax_query instanceof \WP_Tax_Query ) {
					$query->tax_query->queries[] = array(
						'taxonomy' => 'category',
						'field'    => 'slug',
						'terms'    => array( 'pauze' ),
						'operator' => 'NOT IN',
					);

					$query->query_vars['tax_query'] = $query->tax_query->queries;
				}
			}
		);
	}
}
