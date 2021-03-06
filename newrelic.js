/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */

var appEnv = 'cilantro-api (' + process.env.NODE_ENV + ')';

exports.config = {
  /**
   * Array of application names.
   */
  app_name: [appEnv],
  /**
   * Your New Relic license key.
   */
  proxy: process.env.PROXY,
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  }
}
