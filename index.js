import exampleRoute from './server/routes/example';
import overview from './server/routes/overview';


export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
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
      ],
      styleSheetPaths: require('path').resolve(__dirname, 'public/app.scss'),
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    init(server, options) { // eslint-disable-line no-unused-vars
      // Add server routes and initialize the plugin here
      exampleRoute(server);
      overview(server);
    }
  });
}