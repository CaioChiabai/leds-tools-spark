from rest_framework import serializers
from .models import (
    Instrutor,
    Automovel,
    Aluno,
    Aula,
)

class InstrutorWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instrutor
        exclude = ("polymorphic_ctype",)

class InstrutorReadSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 1
        model = Instrutor
        exclude = ("polymorphic_ctype",)


class AutomovelWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Automovel
        exclude = ("polymorphic_ctype",)

class AutomovelReadSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 1
        model = Automovel
        exclude = ("polymorphic_ctype",)


class AlunoWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aluno
        exclude = ("polymorphic_ctype",)

class AlunoReadSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 1
        model = Aluno
        exclude = ("polymorphic_ctype",)


class AulaWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aula
        exclude = ("polymorphic_ctype",)

class AulaReadSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 1
        model = Aula
        exclude = ("polymorphic_ctype",)

