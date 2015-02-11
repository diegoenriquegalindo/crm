var CRM = Ember.Application.create({
  rootElement:     '#content',
  LOG_TRANSITIONS: true
});

CRM.Router.map(function(){
  this.resource('tasks',function() {
    this.resource('task',{path:'/:task_id'});
  });
  this.resource('customer',{path:'/:customer_id'});
});

CRM.IndexController = Ember.ArrayController.extend({
  actions:{
    customerSelect: function(id){
      this.transitionToRoute('customer',id);
    }
  }
});
CRM.TasksListController = Ember.ArrayController.extend({
  isNewTaskVisible: false,
  taskType: 'cService',
  isCService: function() {
    if (this.taskType==='cService') {return true;}
    else {return false;}
  }.property('taskType'),
  isShipping: function() {
    if (this.taskType==='shipping') {return true;}
    else {return false;}
  }.property('taskType'),
  actions:{
    addTask: function() {
      this.toggleProperty('isNewTaskVisible');
    },
    typeSelect: function(type) {
      this.set('taskType',type);
    }
  }
});

CRM.IndexRoute = Ember.Route.extend({
  model: function(){
    return this.store.findAll('customer');
  },
  activate: function() {
    $("#customers-label").css('background-color','#2F79B9');
    $("#tasks-label").css('background-color','#78AEDC');
  }
});
CRM.TasksRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll('task');
  },
  activate: function() {
    $("#tasks-label").css('background-color','#2F79B9');
    $("#customers-label").css('background-color','#78AEDC');
  }
});

CRM.TaskView = Ember.View.extend({
  infoExpanded: false,
  click: function(){
    this.toggleProperty('infoExpanded');
    var taskText = this.task.get('text');
    if(this.infoExpanded) {
      $('<tr><td></td><td>'+taskText+'</td><td colspan=\'3\'></td></tr>').
        insertAfter('#'+this.task.id).addClass('task-info');
    }
    else {
      $('#'+this.task.id).next().remove();
    }
  }
});
CRM.NewTaskView = Ember.View.extend({
  didInsertElement : function(){
    this._super();
    Ember.run.scheduleOnce('afterRender', this, function(){
      $('.input-group.date').datepicker({
        autoclose: true
      });
    });
  }
});
CRM.CServiceInputsView = Ember.View.extend({});
CRM.ShippingInputsView = Ember.View.extend({});

CRM.ApplicationAdapter = DS.FixtureAdapter.extend();

CRM.Customer = DS.Model.extend({
  name:     DS.attr('string'),
  detail:   DS.attr('number'),
  contact:  DS.attr('string'),
  position: DS.attr('string'),
  username: DS.attr('string'),
  tasks:    DS.hasMany('task',{async:true})
});
CRM.Customer.FIXTURES = [
  { id: 1,  name: "Apple",       detail: 10001, contact: "Rodrigo",   position: "Manager",   username: "pablo",  tasks: [10001,10002] },
  { id: 2,  name: "Davivienda",  detail: 10002, contact: "Tim",       position: "Farmer",    username: "pablo",  tasks: [10003] },
  { id: 3,  name: "San Mateo",   detail: 10003, contact: "Mateo",     position: "Engineer",  username: "diego",  tasks: [] },
  { id: 4,  name: "Bancolombia", detail: 10004, contact: "Miguel",    position: "Manager",   username: "diego",  tasks: [] },
  { id: 5,  name: "Wok",         detail: 10005, contact: "Lauren",    position: "Economist", username: "pablo",  tasks: [10004,10005] },
  { id: 6,  name: "Alpina",      detail: 10006, contact: "Silvana",   position: "Producer",  username: "marcos", tasks: [] },
  { id: 7,  name: "Exito",       detail: 10007, contact: "Melissa",   position: "Actor",     username: "pablo",  tasks: [10006] },
  { id: 8,  name: "Colsubsidio", detail: 10008, contact: "Sergio",    position: "Secretary", username: "marcos", tasks: [10007,10008,10009] },
  { id: 9,  name: "Motorola",    detail: 10009, contact: "Sebastian", position: "Investor",  username: "marcos", tasks: [] },
  { id: 10, name: "P&G",         detail: 10010, contact: "Camilo",    position: "Writer",    username: "diego",  tasks: [10010] }
];

CRM.Task = DS.Model.extend({
  text:       DS.attr('string'),
  createAt:   DS.attr('date'),
  isCService: DS.attr('boolean'),
  isShipping: DS.attr('boolean'),
  when:       DS.attr('date'),
  appoint:    DS.attr('date'),
  itemNum:    DS.attr('string'),
  quantity:   DS.attr('number'),
  customer:   DS.belongsTo('customer', {async:true})
});
CRM.Task.FIXTURES = [
  { id: 10001, customer: 1,  text: 'first task',   createAt: new Date(2015,1,15,13,0,0,0), isCService: true,  isShipping: false, when: new Date(2015,1,15,13,0,0,0), appoint: new Date(2015,1,15,13,0,0,0), itemNum: null, quantity: null},
  { id: 10002, customer: 1,  text: 'second task',  createAt: new Date(2015,1,15,13,0,0,0), isCService: true,  isShipping: false, when: new Date(2015,1,15,13,0,0,0), appoint: new Date(2015,1,15,13,0,0,0), itemNum: null, quantity: null},
  { id: 10003, customer: 2,  text: 'third task',   createAt: new Date(2015,1,15,13,0,0,0), isCService: true,  isShipping: false, when: new Date(2015,1,15,13,0,0,0), appoint: new Date(2015,1,15,13,0,0,0), itemNum: null, quantity: null},
  { id: 10004, customer: 5,  text: 'fourth task',  createAt: new Date(2015,1,15,13,0,0,0), isCService: true,  isShipping: false, when: new Date(2015,1,15,13,0,0,0), appoint: new Date(2015,1,15,13,0,0,0), itemNum: null, quantity: null},
  { id: 10005, customer: 5,  text: 'fifth task',   createAt: new Date(2015,1,15,13,0,0,0), isCService: true,  isShipping: false, when: new Date(2015,1,15,13,0,0,0), appoint: new Date(2015,1,15,13,0,0,0), itemNum: null, quantity: null},
  { id: 10006, customer: 7,  text: 'sixth task',   createAt: new Date(2015,1,15,13,0,0,0), isCService: false, isShipping: true,  when: null,                         appoint: null,                         itemNum: 'a',  quantity: 1},
  { id: 10007, customer: 8,  text: 'seventh task', createAt: new Date(2015,1,15,13,0,0,0), isCService: false, isShipping: true,  when: null,                         appoint: null,                         itemNum: 'b',  quantity: 5},
  { id: 10008, customer: 8,  text: 'eighth task',  createAt: new Date(2015,1,15,13,0,0,0), isCService: false, isShipping: true,  when: null,                         appoint: null,                         itemNum: 'c',  quantity: 3},
  { id: 10009, customer: 8,  text: 'nineth task',  createAt: new Date(2015,1,15,13,0,0,0), isCService: false, isShipping: true,  when: null,                         appoint: null,                         itemNum: 'd',  quantity: 9},
  { id: 10010, customer: 10, text: 'tenth task',   createAt: new Date(2015,1,15,13,0,0,0), isCService: false, isShipping: true,  when: null,                         appoint: null,                         itemNum: 'e',  quantity: 2}
];


