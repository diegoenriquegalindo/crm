from home.models import Customer, Task
from rest_framework import serializers

class CustomerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Customer
        fields = ('id','name','contact','position')

class TaskSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Task
        fields = ('text','createAt','isCService','isShipping','when',\
                'appoint','itemNum','quantity','customer')

