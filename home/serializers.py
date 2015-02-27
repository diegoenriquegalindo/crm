from home.models import Customer, Task
from rest_framework import serializers

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ('id','name','contact','position')

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id','owner','text','createAt',\
                'taskType','when','appoint','serialNumber',\
                'partNumber','quantity','customer')
