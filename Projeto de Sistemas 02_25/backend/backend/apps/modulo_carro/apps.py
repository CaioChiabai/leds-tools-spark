from django.apps import AppConfig

class Modulo_carroConfig(AppConfig):
    name  = 'apps.modulo_carro'
    label = 'apps_modulo_carro'

    def ready(self):
        import apps.modulo_carro.signals
