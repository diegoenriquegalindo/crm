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
  queryParams: ['page'],
  page: 1,
  actions:{
    customerSelect: function(id){
      this.transitionToRoute('customer',id);
    },
    pageSelect: function(page) {
      this.set('page',page);
      this.transitionToRoute({queryParams: {page: 'page'}});
    }
  },
  numPages: function() {
    return this.store.metadataFor('customer',{page:1}).num_pages;
  }.property('buttonArray'),
  buttonArray: function() {
    var bArray = Array(7);
    var numPages = this.get('numPages');
    var page = this.get('page');
    numPages = this.store.metadataFor('customer',{page:1}).num_pages;
    var notVisible = 7 - numPages;
    for(var i=0;i<numPages;i++) {
      var isSelected = false;
      if(i===page-1) isSelected = true;
      bArray[i] = {number:String(i+1),isVisible:true,isSelected:isSelected};
    }
    return bArray;
  }.property('page'),
  customers: function() {
    return this.store.find('customer',{page:this.page});
  }.property('page')
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
  clearInputs: function() {
    this.set('customer','');
    this.set('beginning','');
    this.set('end','');
    this.set('itemNum','');
    this.set('quantity','');
    this.set('description','');
  },
  actions:{
    showAddTask: function() {
      this.clearInputs();
      this.toggleProperty('isNewTaskVisible');
    },
    typeSelect: function(type) {
      this.clearInputs();
      this.set('taskType',type);
    },
    addTask: function() {
      var controller = this;
      var whenValue = null, appointValue = null;
      if (controller.get('isCService') ){
        whenValue    = new Date(controller.get('beginning'));
        appointValue = new Date(controller.get('end'));
      }
      var task = this.store.createRecord('task',{
        text:       controller.get('description'),
        createAt:   new Date(),
        isCService: controller.get('isCService'),
        isShipping: controller.get('isShipping'),
        when:       whenValue,
        appoint:    appointValue,
        itemNum:    controller.get('itemNum'),
        quantity:   controller.get('quantity'),
        customer:   this.store.find('customer',1)
      });
      task.save().then(function(){
        controller.clearInputs();
        controller.toggleProperty('isNewTaskVisible');
      });
    }
  }
});

CRM.IndexRoute = Ember.Route.extend({
  queryParams: {
    page:{refreshModel:true}
  },
  model: function(params) {
    return this.store.find('customer',{page:params.page});
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

CRM.ApplicationAdapter = DS.RESTAdapter.extend();

CRM.Customer = DS.Model.extend({
  name:     DS.attr('string'),
  detail:   DS.attr('number'),
  contact:  DS.attr('string'),
  position: DS.attr('string'),
  username: DS.attr('string'),
  tasks:    DS.hasMany('task',{async:true})
});

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

