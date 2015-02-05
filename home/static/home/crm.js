var CRM = Ember.Application.create({
  rootElement:     '#content',
  LOG_TRANSITIONS: true
});

CRM.Router.map(function(){
  this.route("tasks");
  this.resource('customer',{path:'/:customer_id'});
});

CRM.IndexController = Ember.ArrayController.extend({
  actions:{
    customerSelect: function(id){
      this.transitionToRoute('customer',id);
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
  activate: function() {
    $("#tasks-label").css('background-color','#2F79B9');
    $("#customers-label").css('background-color','#78AEDC');
  }
});

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
  text: DS.attr('string')
});
CRM.Task.FIXTURES = [
  { id:10001, text:'first task' },
  { id:10002, text:'second task' },
  { id:10003, text:'third task' },
  { id:10004, text:'fourth task' },
  { id:10005, text:'fifth task' },
  { id:10006, text:'sixth task' },
  { id:10007, text:'seventh task' },
  { id:10008, text:'eighth task' },
  { id:10009, text:'nineth task' },
  { id:10010, text:'tenth task' },
];


