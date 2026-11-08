/** Host plugin of the dsh-agentswarm bundle: registers the packaged agentswarm-work skill. */

import { skillProvider } from './skill-provider.js'

/** Cordis plugin name. */
export const name = 'dsh-agentswarm'
/** Without the skill registry the plugin stays inactive instead of throwing. */
export const inject = ['skills']

/** Register the packaged `agentswarm-work` provider on `ctx.skills`. */
export function apply(ctx) {
  ctx.skills.registerProvider(() => skillProvider)
}
