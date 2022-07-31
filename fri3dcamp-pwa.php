<?php
/**
 * Plugin Name:     Fri3d Camp PWA
 * Plugin URI:      https://app.fri3d.be
 * Description:     WordPress plugin containing a PWA for Fri3d Camp 2022.
 * Author:          Koen Van den Wijngaert <koen@neok.be>
 * Author URI:      https://www.neok.be
 * Text Domain:     fri3dcamp-pwa
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         Fri3dCamp\Pwa
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	return;
}

require_once __DIR__ . '/vendor/autoload.php';

use Fri3dCamp\Pwa\Plugin;

$GLOBALS['FRI3D_PWA'] = new Plugin();

add_filter(
	'rest_pre_serve_request',
	static function ( $stop ) {
		header( 'Access-Control-Expose-Headers: Content-Length, X-WP-Total, X-WP-TotalPages' );

		return $stop;
	},
	0
);
