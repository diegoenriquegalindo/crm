var CRM = Ember.Application.create({
  rootElement: '#content',
  LOG_TRANSITIONS: true
});

CRM.ApplicationView = Ember.View.extend({
  classNames: ['col-md-9']
});
