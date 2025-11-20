import { backend } from 'leds-spark-lib';
const generateModels = backend.python.generateModelGenerator;
const generateAdmin = backend.python.generateAdminGenerator;
const generateSerializer = backend.python.generateSerializeGenerator;
const generateURLAPI = backend.python.generateUrlGenerator;
const generateAPIView = backend.python.generateViewGenerator;
const generateAppsComments = backend.python.generateAppsGenerator;
const generatePaginationComments = backend.python.generatePaginationComments;
const generateUtil = backend.python.generateUtil;

import { base_ident, capitalizeString, createPath } from '../../../../../util/generator-utils.js'
import { Attribute, Entity, LocalEntity, Model, Module, isLocalEntity, isModule, Actor } from '../../../../../../language/generated/ast.js'
import path from 'path'
import fs from 'fs'
import { expandToStringWithNL } from 'langium/generate'
const ident = base_ident

export function generateModules(app: Model, target_folder: string) : void {
    // Processa quais Entidades representam algum ator
    const entity_to_actor = new Map<Entity, Actor>()
    // app.abstractElements.filter(isActor).forEach(a => {
    //     if(a.entity.ref) {
    //         entity_to_actor.set(a.entity.ref, a)
    //     }
    // })

    const APPS_PATH = createPath(target_folder, "backend", "apps/")
    // Criando os models, service e applications
    for(const m of app.abstractElements.filter(isModule)) {
        const MODULE_PATH = createPath(APPS_PATH, m.name.toLowerCase())

        fs.writeFileSync(path.join(createPath(MODULE_PATH, "migrations/"), "__init__.py"), "")

        fs.writeFileSync(path.join(MODULE_PATH, "/__init__.py"), create_init(m))
        fs.writeFileSync(path.join(MODULE_PATH, "/models.py"), generateModels(m as any))
        fs.writeFileSync(path.join(MODULE_PATH, "/admin.py"), generateAdmin(m as any))
        fs.writeFileSync(path.join(MODULE_PATH, "/utils.py"), generateUtil())

        // fs.writeFileSync(APPS_PATH + m.name.toLowerCase + "/factory.py", m.createFactory)

    // Gera apenas os comentários do app pela lib
    fs.writeFileSync(path.join(MODULE_PATH, "/apps.py"), generateAppsComments(m as any))

      
        fs.writeFileSync(path.join(MODULE_PATH, "/api_urls.py"), generateURLAPI(m as any))
        fs.writeFileSync(path.join(MODULE_PATH, "/api_views.py"), generateAPIView(m as any, new Set(entity_to_actor.keys()) as any))

    // Gera apenas os comentários de paginação pela lib
    fs.writeFileSync(path.join(MODULE_PATH, "/pagination.py"), generatePaginationComments())
        fs.writeFileSync(path.join(MODULE_PATH, "/signals.py"), generateSignals(m, entity_to_actor))
        fs.writeFileSync(path.join(MODULE_PATH, "/serializers.py"), generateSerializer(m as any))

        const TEST_PATH = createPath(MODULE_PATH, "/test/unit/")
        for(const e of m.elements.filter(isLocalEntity)) {
            fs.writeFileSync(path.join(TEST_PATH, e.name.toLowerCase()+"_tests.py"), createclasstest(e, m))
        }
    }
}

/*
'é sempre as mesmas funções'
function generateUtil() : string {
    const lines = [
        `from hashids import Hashids`,
        `from django.conf import settings`,
        ``,
        `hashids = Hashids(settings.HASHIDS_SALT, min_length=8)`,
        ``,
        `def h_encode(id):`,
        ``,
        `${ident}"""`,
        `${ident}@param id: ID numérico a ser codificado`,
        `${ident}@return: ID codificado em hash`,

        `${ident}Nota: Código gerado por leds-tools-spark`,
        `${ident}"""`,
        ``,
        `${ident}return hashids.encode(id)`,
        ``,
        `def h_decode(h):`,
        ``,
        `${ident}"""`,
        `${ident}@param h: Hash a ser decodificado`,
        `${ident}@return: ID decodificado`,

        `${ident}Nota: Código gerado por leds-tools-spark`,
        `${ident}"""`,
         ``,
        `${ident}if z := hashids.decode(h):`,
        `${ident}${ident}return z[0]`,
        ``,
        `class HashIdConverter:`,
        ``,
        `${ident}"""`,
        `${ident}Conversor de Hashids para URLs no Django.`,
        `${ident}Nota: Código gerado por leds-tools-spark`,
        `${ident}"""`,
        ``,
        `${ident}regex = '[a-zA-Z0-9]{8,}'`,
        ``,
        `${ident}def to_python(self, value):`,
        ``,
        `${ident}${ident}"""`,
        `${ident}${ident}@param value: Hash da URL`,
        `${ident}${ident}@return: ID decodificado`,

        `${ident}${ident}Nota: Código gerado por leds-tools-spark`,
        `${ident}${ident}"""`,
        ``,
        `${ident}${ident}return h_decode(value)`,
        ``,
        `${ident}def to_url(self, value):`,
        `${ident}${ident}"""`,
        `${ident}${ident}@param value: ID numérico`,
        `${ident}${ident}@return: Hash codificado`,
        `${ident}${ident}Nota: Código gerado por leds-tools-spark`,
        `${ident}${ident}"""`,
        ``,
        `${ident}${ident}return h_encode(value)`,
        ``
    ]

    return lines.join('\n')
}
/*

/*
function pagination() : string {
    const lines = [
        `from rest_framework import pagination`,
        `from rest_framework.response import Response`,
        ``,
        `"""`,
        `Classe de paginação personalizada usando PageNumberPagination.`,
            `@param self: Instância atual`,
            `@param data: Dados paginados`,
            `@return: Response com os dados e metadados`,
            `Nota: Código gerado por leds-tools-spark`,
        `"""`,
        ``,
        `class CustomPagination(pagination.PageNumberPagination):`,
        `${ident}page_size = 10`,
        `${ident}page_size_query_param = 'page_size'`,
        `${ident}max_page_size = 1000`,
        ``,
        `${ident}def get_paginated_response(self, data):`,
        `${ident}${ident}return Response({`,
        `${ident}${ident}${ident}'meta': {`,
        `${ident}${ident}${ident}${ident}'current_page': self.page.number,`,
        `${ident}${ident}${ident}${ident}'per_page': self.page.paginator.per_page,`,
        `${ident}${ident}${ident}${ident}'max_per_page': self.max_page_size,`,
        `${ident}${ident}${ident}${ident}'total': self.page.paginator.count`,
        `${ident}${ident}${ident}},`,
        `${ident}${ident}${ident}'data': data`,
        `${ident}${ident}})`,
        ``
    ]

    return lines.join('\n')
}
*/
function create_init(m: Module) {
    return `default_app_config = 'apps.${m.name.toLowerCase()}.apps.${capitalizeString(m.name)}Config'\n`
}


//function createApps(m: Module) : string {
  //  const lines = [
    //    `from django.apps import AppConfig`,
        // `from django.utils.translation import gettext_lazy as _`,
     //   ``,
       // `class ${capitalizeString(m.name)}Config(AppConfig):`,
        //`${ident}"""`,
        //`${ident}Configuração da aplicação ${m.name}.`,
        //`${ident}Nota: Código gerado por leds-tools-spark`,
        //`${ident}"""`,
        //``,
        //`${ident}name  = 'apps.${m.name.toLowerCase()}'`,
        //`${ident}label = 'apps_${m.name.toLowerCase()}'`,
        //``,
        //`${ident}def ready(self):`,
        //`${ident}"""`,
        //`${ident}Executado quando a aplicação está pronta.`,
        //`${ident}Importa os signals da aplicação.`,
        //`${ident}Nota: Código gerado por leds-tools-spark`,
        //`${ident}"""`,
        //``,
        //`${ident}${ident}import apps.${m.name.toLowerCase()}.signals`,
        //``,
    //]

    //return lines.join('\n')
//}

function createattributeJsontest(e: LocalEntity) {
    return e.attributes.map(a => `'${a.name}' : ${createAtrributeValuesTest(a)}`)
}

function createattributetest(e: LocalEntity) : string {
    return e.attributes.map(a => `${a.name} = ${createAtrributeValuesTest(a)}`).join(', ')
}

function createAtrributeValuesTest(a: Attribute) : string {
    switch (a.type.toLowerCase()) {
        case 'cpf':     return "self.faker.cpf()"
        case 'cnpj':    return "self.faker.cnpj()"
        case 'string':  return "self.faker.first_name()"
        case 'integer': return "random.uniform(0, 100)"
        case 'decimal': return "random.uniform(0.00, 100.5)"
        case 'email':   return "self.faker.ascii_company_email()"
        case 'url':     return `'http://'+ self.fake.domain_name()`

        case 'telefone':
        case 'celular':
            return "self.faker.phone_number()"

        case 'datetime':
        case 'date':
            return "self.faker.date()"

        default:
            return "TODO"
    }
}

function createclasstest(e: LocalEntity, m: Module) : string {
    const lines = [
        `import json`,
        `from rest_framework import status`,
        `from django.test import TestCase, Client`,
        `from django.urls import reverse`,
        `from ${m.name.toLowerCase()}.models import ${e.name}`,
        `from ${m.name.toLowerCase()}.serializers import ${e.name}Serializer`,
        `from faker import Faker`,
        `import random`,
        ``,
        `class ${e.name}Tests(TestCase):`,
        `${ident}def setUp(self):`,
        `${ident}${ident}self.faker = Faker('pt_BR')`,
        `${ident}${ident}self.client = Client()`,
        ``,
        `${ident}${ident}self.${e.name.toLowerCase()}_1 = ${e.name}.objects.create(${createattributetest(e)})`,
        `${ident}${ident}self.${e.name.toLowerCase()}_2 = ${e.name}.objects.create(${createattributetest(e)})`,
        `${ident}${ident}self.${e.name.toLowerCase()}_3 = ${e.name}.objects.create(${createattributetest(e)})`,
        ``,
        `${ident}${ident}self.valid_payload = {`,
        `${ident}${ident}${ident}${createattributeJsontest(e)}`,
        `${ident}${ident}}`,
        `${ident}${ident}self.invalid_payload = {`,
        // TODO Como gerar um payload invalido
        `${ident}${ident}${ident}${createattributeJsontest(e)}`,
        `${ident}${ident}}`,
        ``,
        `${ident}def test_valid_create(self):`,
        `${ident}${ident}response = self.client.post(`,
        `${ident}${ident}${ident}reverse('${e.name.toLowerCase()}-api-list'),`,
        `${ident}${ident}${ident}data=json.dumps(self.valid_payload),`,
        `${ident}${ident}${ident}content_type='application/json'`,
        `${ident}${ident})`,
        `${ident}${ident}self.assertEqual(response.status_code, status.HTTP_201_CREATED)`,
        ``,
        `${ident}def test_invalid_create(self):`,
        `${ident}${ident}response = self.client.post(`,
        `${ident}${ident}${ident}reverse('${e.name.toLowerCase()}-api-list'),`,
        `${ident}${ident}${ident}data=json.dumps(self.invalid_payload),`,
        `${ident}${ident}${ident}content_type='application/json'`,
        `${ident}${ident})`,
        `${ident}${ident}self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)`,
        ``,
        `${ident}def test_valid_upload(self):`,
        `${ident}${ident}response = self.client.put(`,
        `${ident}${ident}${ident}reverse('${e.name.toLowerCase()}-detail',`,
        `${ident}${ident}${ident}kwargs={'pk': self.${e.name.toLowerCase()}_1.id}),`,
        `${ident}${ident}${ident}data=json.dumps(self.valid_payload),`,
        `${ident}${ident}${ident}content_type='application/json'`,
        `${ident}${ident})`,
        `${ident}${ident}self.assertEqual(response.status_code, status.HTTP_200_OK)`,
        ``,
        `${ident}def test_invalid_upload(self):`,
        `${ident}${ident}response = self.client.put(`,
        `${ident}${ident}${ident}reverse('${e.name.toLowerCase()}-detail',`,
        `${ident}${ident}${ident}kwargs={'pk': self.${e.name.toLowerCase()}_1.id}),`,
        `${ident}${ident}${ident}data=json.dumps(self.invalid_payload),`,
        `${ident}${ident}${ident}content_type='application/json'`,
        `${ident}${ident})`,
        `${ident}${ident}self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)`,
        ``,
        `${ident}# retornando todos os elementos    `,
        `${ident}def test_retrieve_all(self):`,
        `${ident}${ident}response   = self.client.get(reverse('${e.name.toLowerCase()}-api-list'))`,
        `${ident}${ident}data       = ${e.name}.objects.all()`,
        `${ident}${ident}serializer = ${e.name}Serializer(data, context={'request': None}, many=True)`,
        `${ident}${ident}# Aqui deve comparar todos os compos do objeto com serialização`,
        `${ident}${ident}self.assertEqual(response.data, serializer.data)`,
        ``,
        `${ident}${ident}self.assertIsNotNone(response.data)`,
        `${ident}${ident}self.assertEqual(response.status_code, status.HTTP_200_OK)`,
        ``,
        `${ident}# retornando um elemento`,
        `${ident}def test_valid_get_element(self):`,
        `${ident}${ident}response = self.client.get(reverse('${e.name.toLowerCase()}-detail',kwargs={'pk': self.${e.name.toLowerCase()}_1.id}))`,
        `${ident}${ident}data = ${e.name}.objects.get(pk=self.condicao_1.id)`,
        `${ident}${ident}# Aqui deve comparar todos os campos do objeto com serialização`,
        `${ident}${ident}self.assertEqual(str(data.uuid),response.data['uuid'])`,
        `${ident}${ident}self.assertIsNotNone(response.data)`,
        `${ident}${ident}self.assertEqual(response.status_code, status.HTTP_200_OK)`,
        ``,
        `${ident}# erro ao retornar um elemento invalido`,
        `${ident}def test_invalid_get_element(self):`,
        `${ident}${ident}response = self.client.get(reverse('${e.name.toLowerCase()}-detail',kwargs={'pk': 666}))`,
        `${ident}${ident}self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)`,
        ``,
        `${ident}# Delete um elemento valido`,
        `${ident}def test_valid_delete(self):`,
        `${ident}${ident}response = self.client.delete(reverse('${e.name.toLowerCase()}-detail',kwargs={'pk': self.${e.name.toLowerCase()}_1.id}))`,
        `${ident}${ident}self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)`,
        ``,
        `${ident}# Delete um elemento valido`,
        `${ident}def test_invalid_delete(self):`,
        `${ident}${ident}response = self.client.delete(reverse('${e.name.toLowerCase()}-detail',kwargs={'pk': 666}))`,
        `${ident}${ident}self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)`,
        ``
    ]

    return lines.join('\n')
}

function generateSignals(m: Module, map: Map<Entity, Actor>) : string {
    const non_abstract_entities = m.elements.filter(isLocalEntity).filter(e => !e.is_abstract)
    const headerComment = [
        `"""`,
        `Signals para as entidades do módulo ${m.name}.`,
        ``,
        'Cada entidade possui os seguintes signals:',
        '- pre_init / post_init: executados antes e depois da inicialização da instância',
        '- pre_save / post_save: executados antes e depois de salvar a instância',
       `- pre_delete / post_delete: executados antes e depois de deletar a instância`,
        `- m2m_changed: executado quando campos ManyToMany são alterados`,
        `Permite executar ações automáticas em momentos específicos do ciclo de vida das instâncias.`,
        `Gerado automaticamente por leds-tools-spark.`,
        `"""`,
        ``
    ]
    const lines = [
        `from .models import ${non_abstract_entities.map(e => e.name).join(', ')}`,
        `from django.db.models.signals import (`,
        `${ident}pre_init,   post_init,`,
        `${ident}pre_save,   post_save,`,
        `${ident}pre_delete, post_delete,`,
        `${ident}m2m_changed`,
        `)`,
        `from django.dispatch import receiver`,
        `from django.contrib.auth.models import Group`,
        // `from .services import *`,
        ``,
         ...headerComment,
        ...non_abstract_entities.flatMap(e => {return [
            `## Signals from ${e.name}`,
            entitySignals(e, map),
            ``,
        ]}),
    ]

    return lines.join('\n')
}

function entitySignals(e: LocalEntity, map: Map<Entity, Actor>) : string {
    const post_save = map.has(e) ?
        expandToStringWithNL`
            if created:
                group = Group.objects.get(name="${map.get(e)?.id}")
                instance.user_application.groups.add(group)
        ` :
        'pass'

    return expandToStringWithNL`
        @receiver(pre_init, sender=${e.name})
        def pre_init_${e.name.toLowerCase()}(sender, *args, **kwargs):
        ${ident}pass

        @receiver(post_init, sender=${e.name})
        def post_init_${e.name.toLowerCase()}(sender, instance, **kwargs):
        ${ident}pass

        @receiver(pre_save, sender=${e.name})
        def pre_save_${e.name.toLowerCase()}(sender, instance, raw, using, update_fields, **kwargs):
        ${ident}pass

        @receiver(post_save, sender=${e.name})
        def post_save_${e.name.toLowerCase()}(sender, instance, created, raw, using, update_fields, **kwargs):
        ${ident}${post_save}

        @receiver(pre_delete, sender=${e.name})
        def pre_delete_${e.name.toLowerCase()}(sender, instance, using, **kwargs):
        ${ident}pass

        @receiver(post_delete, sender=${e.name})
        def post_delete_${e.name.toLowerCase()}(sender, instance, using, **kwargs):
        ${ident}pass

        @receiver(m2m_changed, sender=${e.name})
        def m2m_changed_${e.name.toLowerCase()}(sender, instance, action, reverse, model, pk_set, using, **kwargs):
        ${ident}pass
    `
}

