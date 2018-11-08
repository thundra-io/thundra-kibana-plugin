import exampleRoute from './server/routes/example';
import api from './server/routes/api';
import metrics from './server/routes/metrics';


export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch', 'kibana'],
    name: 'thundra',
    uiExports: {
      app: {
        title: 'Thundra',
        description: 'Thundra',
        main: 'plugins/thundra/app',
        icon: 'plugins/thundra/thundra-bird-white.svg'
      },
      hacks: [
        'plugins/thundra/hack'
      ]
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    init(server, options) { // eslint-disable-line no-unused-vars
      // Add server routes and initialize the plugin here
      exampleRoute(server);
      api(server);
      metrics(server);
    }
  });
}
