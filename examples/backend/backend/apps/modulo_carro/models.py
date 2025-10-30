from django.db import models
from django.utils.translation import gettext_lazy as _
from polymorphic.models import PolymorphicModel

class Sexo(models.TextChoices):
    """"""
    FEMININO = 'FEMININO', _('Feminino')
    MASCULINO = 'MASCULINO', _('Masculino')

class TipoAutomovel(models.TextChoices):
    """"""
    CARRO = 'CARRO', _('Carro')
    MOTO = 'MOTO', _('Moto')


class Instrutor(PolymorphicModel, models.Model):
    ''''''

    nome = models.CharField(max_length=300, null=True, blank=True)
    cpfstring = models.CharField(max_length=300, null=True, blank=True)
    numero = models.CharField(max_length=300, null=True, blank=True)

    sexo = models.CharField(max_length=9, choices=Sexo.choices, default=Sexo.FEMININO)

    aulas = models.ForeignKey('Aula', blank=True, null=True, on_delete=models.CASCADE, related_name="aulas_%(class)s")

    class Meta:
        db_table = 'instrutor'

class Automovel(PolymorphicModel, models.Model):
    ''''''

    placa = models.CharField(max_length=300, null=True, blank=True)

    tipo = models.CharField(max_length=5, choices=TipoAutomovel.choices, default=TipoAutomovel.CARRO)

    aulas = models.ForeignKey('Aula', blank=True, null=True, on_delete=models.CASCADE, related_name="aulas_%(class)s")

    class Meta:
        db_table = 'automovel'

class Aluno(PolymorphicModel, models.Model):
    ''''''

    nome = models.CharField(max_length=300, null=True, blank=True)
    cpfstring = models.CharField(max_length=300, null=True, blank=True)
    numero = models.CharField(max_length=300, null=True, blank=True)

    sexo = models.CharField(max_length=9, choices=Sexo.choices, default=Sexo.FEMININO)

    aulas = models.ForeignKey('Aula', blank=True, null=True, on_delete=models.CASCADE, related_name="aulas_%(class)s")

    class Meta:
        db_table = 'aluno'

class Aula(PolymorphicModel, models.Model):
    ''''''



    aluno = models.ForeignKey(Aluno, blank=True, null=True, on_delete=models.CASCADE, related_name="aluno_%(class)s")
    instrutor = models.ForeignKey(Instrutor, blank=True, null=True, on_delete=models.CASCADE, related_name="instrutor_%(class)s")
    automovel = models.ForeignKey(Automovel, blank=True, null=True, on_delete=models.CASCADE, related_name="automovel_%(class)s")

    class Meta:
        db_table = 'aula'

