<?php
/**
 * Plugin.php
 *
 * @author Koen Van den Wijngaert <koen@neok.be>
 * @package Fri3dCamp\Pwa
 */

namespace Fri3dCamp\Pwa;

use Fri3dCamp\Pwa\Util\Hooks;

/**
 * Class Plugin
 *
 * @package Fri3dCamp\Pwa
 */
class Plugin {
	/**
	 * Modules
	 *
	 * @var array List of loaded modules.
	 */
	public array $modules = array();

	/**
	 * Gateway constructor.
	 */
	public function __construct() {
		add_action( 'plugins_loaded', array( $this, 'init_modules' ) );
	}

	/**
	 * Initialize modules.
	 */
	public function init_modules(): void {
		static $modules = array(
			Settings::class,
			Hooks::class,
			PushNotifications::class,
			Updates::class,
		);

		$this->modules = array_map(
			static function ( string $class_name ) {
				return new $class_name();
			},
			$modules
		);
	}
}
