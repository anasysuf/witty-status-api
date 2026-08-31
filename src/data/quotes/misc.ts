import { StatusQuote } from '../../types/index.js';

export const QUOTES_MISC: StatusQuote[] = [
  // 418 I'm a Teapot
  {
    id: '418-short-and-stout',
    code: 418,
    category: 'client_error',
    title: "I'm a Teapot",
    headline: 'Short, stout, and unable to brew coffee',
    wittyMessage: 'You asked for coffee, but this server is an authentic RFC 2324 teapot. We brew Earl Grey, not espresso.',
    technicalDetails: 'RFC 2324 Hyper Text Coffee Pot Control Protocol compliance test.',
    actionAdvice: 'Direct your coffee requests to a certified barista or coffee machine endpoint.',
    suggestedAction: 'retry'
  },
  {
    id: '418-earl-grey-only',
    code: 418,
    category: 'client_error',
    title: "I'm a Teapot",
    headline: 'Earl Grey is the only beverage on the menu',
    wittyMessage: 'Hot water, fragrant tea leaves, and zero coffee beans. Handle with care, this server is porcelain.',
    technicalDetails: 'Hyper Text Coffee Pot Control Protocol: Attempted coffee brew on tea device.',
    actionAdvice: 'Switch your request to tea or seek an espresso-enabled microservice.',
    suggestedAction: 'retry'
  },

  // 501 Not Implemented
  {
    id: '501-drawing-board',
    code: 501,
    category: 'server_error',
    title: 'Not Implemented',
    headline: 'Still drawn on our whiteboard in marker',
    wittyMessage: 'You asked for something awesome, but our engineering team has not written the code for it yet. Patience is a virtue.',
    technicalDetails: 'Method handler not implemented on this route version.',
    actionAdvice: 'Check our public roadmap to track when this feature will be delivered.',
    suggestedAction: 'back'
  },
  {
    id: '501-backlog-item-402',
    code: 501,
    category: 'server_error',
    title: 'Not Implemented',
    headline: 'Currently sitting in sprint backlog refinement',
    wittyMessage: 'Our product manager loves this idea, but the sprint capacity was full. It is slated for next quarter.',
    technicalDetails: 'Stub controller reached with no operational backend handler.',
    actionAdvice: 'Vote for this feature in our developer community portal.',
    suggestedAction: 'back'
  }
];
