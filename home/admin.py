from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from home.models import Customer, Task, Vendor
from django.contrib.auth.forms import UserChangeForm, UserCreationForm

class VendorChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = Vendor
    def __init__(self, *args, **kwargs):
        super(VendorChangeForm, self).__init__(*args, **kwargs)
        f = self.fields.get('user_permissions', None)
        if f is not None:
            f.queryset = f.queryset.select_related('content_type')

class VendorCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = Vendor
    def clean_username(self):
        username = self.cleaned_data["username"]
        try:
            Vendor._default_manager.get(username=username)
        except Vendor.DoesNotExist:
            return username
        raise forms.ValidationError(
            self.error_messages['duplicate_username'],
            code='duplicate_username',
        )
    def save(self, commit=True):
        user = super(VendorCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user

class VendorAdmin(UserAdmin):
    form = VendorChangeForm
    add_form = VendorCreationForm
    fieldsets = UserAdmin.fieldsets + (
            (None, {'fields': ('vendor_id','name',\
                    'citizenship_card','commission',)}),
    )

admin.site.register(Customer)
admin.site.register(Task)
admin.site.register(Vendor, VendorAdmin)


