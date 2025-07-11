import 'entities'

// Definição de Atores
Actor:
    (Comment)?
    'actor' id=QualifiedName ('name' ':' fullName=STRING)? ('extends' superType=[Actor:QualifiedName])?
    (Comment)?
;

// Definição de Casos de Uso
UseCase:
    (Comment)?
    'usecase' id=QualifiedName ('extends' superType=[UseCase:QualifiedName])? '{'
        Name
        Description?
        'uctype' ':' uctype=UCTYPE
        ('route' ':' routeUC=STRING)?
        ('class' ':' entity=[LocalEntity:QualifiedName])?
        'performer' ':' actors+=[Actor:QualifiedName] (',' actors+=[Actor:QualifiedName])*
        (events+=Event)*
        
    '}'
    (Comment)?
;

// Definição de Eventos
Event:
    'event' id=ID '{'
        (Name
        Description?
        ('route' ':' routeEvent=STRING)?
        'action' ':' action=STRING
        ('depend' ':' depends+=[Event:QualifiedName] (',' depends+=[Event:QualifiedName])*)?
        )*
    '}'
;
