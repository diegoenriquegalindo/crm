import pickle
from django.contrib.auth.models import User
from home.models import Employee
from sets import Set

f = open("vendedores.pkl")
employees = pickle.load(f)
username_set = Set()

def get_username(first_name):
    first_name = first_name.lower()
    username = first_name
    user_num = 1
    while username in username_set:
        username = first_name + str(user_num)
        user_num += 1
    username_set.add(username)
    return username

for employee in employees[1]:
    if employee[0] == 'ND': continue
    first_name = employee[1].split()[0]
    username = get_username(first_name)
    new_user = User.objects.create_user(username,'','piggy')
    new_employee = Employee()
    new_employee.user = new_user
    new_employee.name = employee[1]
    employee_id = employee[2]
    try: employee_id = int(employee_id)
    except ValueError: employee_id = None
    new_employee.employee_id = employee_id
    commission = employee[3]
    try: commission = float(commission)
    except ValueError: commission = None
    new_employee.commission = commission
    # new_employee.customers = new_user
    new_employee.save()

f = open("cliente_vendedor.pkl")
customers = pickle.load(f)

for custom in customers[1]:
    pass

new_user = User.objects.create_user('pablo','pagalindo@gmail.com','piggy')

new_employee = Employee()
new_employee.user = new_user
new_employee.save()

