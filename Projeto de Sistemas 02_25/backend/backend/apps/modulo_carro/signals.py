from .models import Instrutor, Automovel, Aluno, Aula
from django.db.models.signals import (
    pre_init,   post_init,
    pre_save,   post_save,
    pre_delete, post_delete,
    m2m_changed
)
from django.dispatch import receiver
from django.contrib.auth.models import Group

## Signals from Instrutor
@receiver(pre_init, sender=Instrutor)
def pre_init_instrutor(sender, *args, **kwargs):
    pass

@receiver(post_init, sender=Instrutor)
def post_init_instrutor(sender, instance, **kwargs):
    pass

@receiver(pre_save, sender=Instrutor)
def pre_save_instrutor(sender, instance, raw, using, update_fields, **kwargs):
    pass

@receiver(post_save, sender=Instrutor)
def post_save_instrutor(sender, instance, created, raw, using, update_fields, **kwargs):
    pass

@receiver(pre_delete, sender=Instrutor)
def pre_delete_instrutor(sender, instance, using, **kwargs):
    pass

@receiver(post_delete, sender=Instrutor)
def post_delete_instrutor(sender, instance, using, **kwargs):
    pass

@receiver(m2m_changed, sender=Instrutor)
def m2m_changed_instrutor(sender, instance, action, reverse, model, pk_set, using, **kwargs):
    pass

## Signals from Automovel
@receiver(pre_init, sender=Automovel)
def pre_init_automovel(sender, *args, **kwargs):
    pass

@receiver(post_init, sender=Automovel)
def post_init_automovel(sender, instance, **kwargs):
    pass

@receiver(pre_save, sender=Automovel)
def pre_save_automovel(sender, instance, raw, using, update_fields, **kwargs):
    pass

@receiver(post_save, sender=Automovel)
def post_save_automovel(sender, instance, created, raw, using, update_fields, **kwargs):
    pass

@receiver(pre_delete, sender=Automovel)
def pre_delete_automovel(sender, instance, using, **kwargs):
    pass

@receiver(post_delete, sender=Automovel)
def post_delete_automovel(sender, instance, using, **kwargs):
    pass

@receiver(m2m_changed, sender=Automovel)
def m2m_changed_automovel(sender, instance, action, reverse, model, pk_set, using, **kwargs):
    pass

## Signals from Aluno
@receiver(pre_init, sender=Aluno)
def pre_init_aluno(sender, *args, **kwargs):
    pass

@receiver(post_init, sender=Aluno)
def post_init_aluno(sender, instance, **kwargs):
    pass

@receiver(pre_save, sender=Aluno)
def pre_save_aluno(sender, instance, raw, using, update_fields, **kwargs):
    pass

@receiver(post_save, sender=Aluno)
def post_save_aluno(sender, instance, created, raw, using, update_fields, **kwargs):
    pass

@receiver(pre_delete, sender=Aluno)
def pre_delete_aluno(sender, instance, using, **kwargs):
    pass

@receiver(post_delete, sender=Aluno)
def post_delete_aluno(sender, instance, using, **kwargs):
    pass

@receiver(m2m_changed, sender=Aluno)
def m2m_changed_aluno(sender, instance, action, reverse, model, pk_set, using, **kwargs):
    pass

## Signals from Aula
@receiver(pre_init, sender=Aula)
def pre_init_aula(sender, *args, **kwargs):
    pass

@receiver(post_init, sender=Aula)
def post_init_aula(sender, instance, **kwargs):
    pass

@receiver(pre_save, sender=Aula)
def pre_save_aula(sender, instance, raw, using, update_fields, **kwargs):
    pass

@receiver(post_save, sender=Aula)
def post_save_aula(sender, instance, created, raw, using, update_fields, **kwargs):
    pass

@receiver(pre_delete, sender=Aula)
def pre_delete_aula(sender, instance, using, **kwargs):
    pass

@receiver(post_delete, sender=Aula)
def post_delete_aula(sender, instance, using, **kwargs):
    pass

@receiver(m2m_changed, sender=Aula)
def m2m_changed_aula(sender, instance, action, reverse, model, pk_set, using, **kwargs):
    pass
