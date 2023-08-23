from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    password_1 = serializers.CharField(write_only=True)
    password_2 = serializers.CharField(write_only=True)
    group = serializers.ListField()

    def validate(self, data):
        if data["password_1"] != data["password_2"]:
            raise serializers.ValidationError("Passwords must match.")

        group_names = set(data.get("group", []))
        existing_group_names = set(Group.objects.values_list("name", flat=True))

        if not group_names.issubset(existing_group_names):
            raise serializers.ValidationError(
                "One or more provided group names do not exist."
            )
        return data

    def create(self, validated_data):
        data = {
            key: value
            for key, value in validated_data.items()
            if key not in ("password_1", "password_2")
        }
        group_names = data.pop("group", [])
        groups = Group.objects.filter(name__in=group_names).values_list("id", flat=True)
        data["password"] = validated_data["password_1"]
        user = self.Meta.model.objects.create_user(**data)
        if groups:
            user.groups.add(*groups)
        user.save()
        return user

    class Meta:
        model = get_user_model()
        fields = (
            "id",
            "email",
            "password_1",
            "password_2",
            "first_name",
            "last_name",
            "group",
        )
        read_only_fields = ("id",)


class LogInSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        user_data = UserSerializer(user).data
        for key, value in user_data.items():
            if key != "id":
                token[key] = value

        return token
