from django.contrib import admin
from .models import Instrutor,Automovel,Aluno,Aula

@admin.register(Instrutor)
class InstrutorAdmin(admin.ModelAdmin):
    list_display = ['id', 'nome', 'cpfstring', 'numero']
    list_display_links = ['id', 'nome', 'cpfstring', 'numero']
    search_fields = ['id', 'nome', 'cpfstring', 'numero']
    list_per_page = 25
    ordering = ['-id']

@admin.register(Automovel)
class AutomovelAdmin(admin.ModelAdmin):
    list_display = ['id', 'placa']
    list_display_links = ['id', 'placa']
    search_fields = ['id', 'placa']
    list_per_page = 25
    ordering = ['-id']

@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
    list_display = ['id', 'nome', 'cpfstring', 'numero']
    list_display_links = ['id', 'nome', 'cpfstring', 'numero']
    search_fields = ['id', 'nome', 'cpfstring', 'numero']
    list_per_page = 25
    ordering = ['-id']

@admin.register(Aula)
class AulaAdmin(admin.ModelAdmin):
    list_display = ['id',]
    list_display_links = ['id',]
    search_fields = ['id',]
    list_per_page = 25
    ordering = ['-id']

