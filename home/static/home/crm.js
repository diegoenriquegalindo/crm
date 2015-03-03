$(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});

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

var searchFunction = function() {
  this.set('page',1);
  var text = this.get('text').toString();
  var controller = this;
  Ember.run.next(function(){
    controller.transitionToRoute({ queryParams: {page:1, search:text} });
  });
};
CRM.IndexController = Ember.ArrayController.extend({
  isIndex: true,
  queryParams: ['page','search'],
  page: 1,
  search: "",
  text: "",
  actions:{
    customerSelect: function(id){
      this.transitionToRoute('customer',id);
    },
    pageSelect: function(page) {
      if (page==='...') return;
      this.set('page',page);
      this.transitionToRoute({queryParams: {page: 'page'}});
    },
    prevNextSelect: function(prevNext) {
      if (this.get('numPages')===1) return;
      var nextPage = 0;
      var page = this.get('page');
      if (prevNext === 'prev') {
        if (page===1) return;
        nextPage = page-1;
      }
      else {
        if (page===this.get('numPages')) return;
        nextPage = page+1;
      }
      this.set('page',nextPage);
      this.transitionToRoute({queryParams: {page: 'page'}});
    },
    search: searchFunction
  },
  numPages: function() {
    return this.store.metadataFor('customer',{page:this.get('page')}).num_pages;
  }.property('model'),
  buttonArray: function() {
    var buttonAmount = 7;
    var visibleLimit = 5;
    var bArray = Array(buttonAmount);
    var numPages = this.get('numPages');
    var page = this.get('page');
    for(var i=0;i<buttonAmount;i++) {
      bArray[i] = {number:String(i+1),isVisible:true,
        isSelected:false,clickable:true};
    }
    if (numPages<=visibleLimit) {
      for(var i = buttonAmount-1;i>=numPages;i--) {
        bArray[i].isVisible = false;
      }
      bArray[page-1].isSelected = true;
    }
    else {
      bArray[buttonAmount-1].number = String(numPages);
      if(page<visibleLimit-1) {
        for(var i=visibleLimit-1;i<buttonAmount-1;i++) {
          bArray[i].number = '...';bArray[i].clickable = false;
        }
        bArray[page-1].isSelected = true;
      }
      else if(page>=numPages-2) {
        for(var i=1;i<3;i++) {
          bArray[i].number = '...'; bArray[i].clickable = false;
        }
        for(var i=3;i<buttonAmount;i++) {
          bArray[i].number = String(i+numPages-6);
          if(page == bArray[i].number) bArray[i].isSelected = true;
        }
      }
      else {
        bArray[1].number = "..."; bArray[1].clickable = false;
        bArray[2].number = String(page-1);
        bArray[3].number = String(page); bArray[3].isSelected = true;
        bArray[4].number = String(page+1);
        bArray[5].number = "..."; bArray[5].clickable = false;
        bArray[6].number = String(numPages);
      }
    }
    return bArray;
  }.property('model'),
});
CRM.TasksController = Ember.Controller.extend({
  isTasks: true
});
CRM.CustomerController = Ember.Controller.extend({
  isIndex: true
});
CRM.TasksListController = Ember.ArrayController.extend({
  isNewTaskVisible: false,
  taskType: 'social',
  taskTypes: function() {
    var typesArray = ['social','technical','meeting','payment','order'];
    var taskArray = [];
    for(var i=0;i<typesArray.length;i++) {
      var isSelected = false;
      if(this.get('taskType') === typesArray[i]) { isSelected = true; }
      taskArray.push({name:typesArray[i],selected:isSelected});
    }
    return taskArray;
  }.property('taskType'),
  isSocialTech: function() {
    var taskType = this.get('taskType');
    if(taskType === 'social' || taskType === 'technical') {return true;}
    else {return false;}
  }.property('taskType'),
  isMeeting: function() {
    var taskType = this.get('taskType');
    if(taskType === 'meeting') {return true;}
    else {return false;}
  }.property('taskType'),
  isPaymentOrder: function() {
    var taskType = this.get('taskType');
    if(taskType === 'payment' || taskType === 'order') {return true;}
    else {return false;}
  }.property('taskType'),
  clearInputs: function() {
    this.set('customer','');
    this.set('begin','');
    this.set('end','');
    this.set('text','');
    this.set('amount','');
    this.set('didPay','');
    this.set('orderNumber','');
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
      var end = null;
      var amount = null;
      var didPay = false;
      var orderNumber = "";
      if(this.get('isMeeting') || this.get('isPaymentOrder')) {
        end = this.get('end');
      }
      if(this.get('isPaymentOrder')) {
        amount = this.get('amount');
      }
      var task = this.store.createRecord('task',{
        owner:        this.store.metadataFor('task',{page:1}).vendor,
        text:         this.get('text'),
        createdAt:    new Date(),
        taskType:     this.get('taskType'),
        begin:        new Date(this.get('begin')),
        end:          end,
        amount:       amount,
        didPay:       didPay,
        orderNumber:  orderNumber,
        customer:     this.store.getById('customer',this.get('customer'))
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
    page:{refreshModel:true},
    search:{refreshModel:true}
  },
  model: function(params) {
    return this.store.find('customer',{page:params.page,search:params.search});
  },
});
CRM.TasksRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll('task');
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
CRM.SocialTechInputsView = Ember.View.extend({});
CRM.MeetingInputsView = Ember.View.extend({});
CRM.PaymentOrderInputsView = Ember.View.extend({});

CRM.ApplicationAdapter = DS.RESTAdapter.extend({
  buildURL: function() {
    var url = this._super.apply(this, arguments);
    if (url.charAt(url.length -1) !== '/') {
      url += '/';
    }
    return url;
  }
});

CRM.Customer = DS.Model.extend({
  name:     DS.attr('string'),
  contact:  DS.attr('string'),
  position: DS.attr('string'),
});

CRM.Task = DS.Model.extend({
  owner:        DS.attr('number'),
  text:         DS.attr('string'),
  createdAt:    DS.attr('date'),
  taskType:     DS.attr('string'),
  begin:        DS.attr('date'),
  end:          DS.attr('date'),
  amount:       DS.attr('number'),
  didPay:       DS.attr('boolean'),
  orderNumber:  DS.attr('string'),
  customer:     DS.belongsTo('customer')
});

Ember.Handlebars.registerBoundHelper('niceDate',function(date) {
  return moment(date).format('ddd, MMMM DD YYYY');
});
