from django.urls import path, register_converter, include
from rest_framework import routers
from .api_views import (
    InstrutorViewSet,
    AutomovelViewSet,
    AlunoViewSet,
    AulaViewSet,
)
router = routers.DefaultRouter()

router.register(r'instrutor', InstrutorViewSet, basename='instrutor')
router.register(r'automovel', AutomovelViewSet, basename='automovel')
router.register(r'aluno', AlunoViewSet, basename='aluno')
router.register(r'aula', AulaViewSet, basename='aula')

urlpatterns = [
    path('modulo_carro/', include(router.urls))
]
