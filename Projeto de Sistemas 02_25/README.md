-Concepção:

A primeira etapa consistiu em entender os componentes de linguagem do Spark, a configuração, os módulos e as entidades. Em seguida, foi definido que o trabalho seria a modelagem de um sistema de aulas de direção. Para visualizar a estrutura do código e as relações entre as entidades, criamos um diagrama, que serviu como guia para a etapa de codificação.

[imagem do diagrama]

-Arquivo Spark:

Começando pela configuração, foram estabelecidos os parâmetros principais do gerador de código, como a linguagem de programação (python), o nome do software (Autoescola), a descrição (Sistema de aulas de direção) e o nome do banco de dados (banco).

Em seguida, foi criado o module 'Modulo_carro' que agrupa todas as entidades e enums do projeto. Dentro desse módulo, quatro entidades foram modeladas: 

    A entidade Instrutor, com atributos para nome (string), cpf (string), numero (string) e sexo (usando a enum Sexo). Essa entidade possui uma relação OneToMany (um para muitos) com a entidade Aula, indicando que um instrutor pode ter múltiplas aulas;

    A entidade Automovel, que tem os atributos tipo (usando a enum TipoAutomovel) e placa (string). Ela também possui uma relação OneToMany com a entidade Aula, pois um automóvel pode ser utilizado em diversas aulas;

    A entidade Aluno, com atributos para nome (string), cpf (string), numero (string) e sexo (usando a enum Sexo), e uma relação OneToMany com a entidade Aula, indicando que um aluno pode ter muitas aulas;

    A entidade Aula, que embora não possua atributos próprios, ela se relaciona com as outras entidades por meio de três relações ManyToOne (muitos para um): uma aula tem um único aluno, um único instrutor e um único automovel;

Por fim, as enums Sexo (Feminino, Masculino) e TipoAutomovel (Carro, Moto) foram criadas para padronizar e restringir os valores dos respectivos atributos nas entidades.

-Desafios e Conclusão:

Um desafio foi definir corretamente os relacionamentos OneToMany e ManyToOne, entretanto a criação de um diagrama de classes, que funcionou como um guia visual para garantir que a modelagem no arquivo .spark seguisse a lógica do sistema, ajudou neste problema.

Concluímos que o Spark é uma ferramenta poderosa e eficiente. Sua sintaxe intuitiva nos permitiu focar na arquitetura do sistema e não nos detalhes de implementação da linguagem de programação.
