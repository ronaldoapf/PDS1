# Análise de Riscos do Software proposto pela Profa. Luziane

### Demandar mais tempo que o estipulado
O projeto em questão apresenta vários casos de uso e possívelmente 3 perfis diferentes para a aplicação, podendo demandar bastante tempo tanto da equipe para implementar/testar a aplicação, quanto da professora Luziane para explicar como cada funcionalidade/perfil deve operar e quais são suas entradas e saídas.
- Probabilidade: **Média**
- Efeitos: **Toleráveis**

### Alta dependência de API que pode fornecer dados duvidosos para a aplicação
O projeto em questão pretende utilizar uma API provida pelo site [openstreetmap](https://www.openstreetmap.org/about) para fazer a coleta de dados inicial e compor a base de dados da aplicação.
Tal projeto é desenvolvido por uma comunidade voluntária de mapeadores que contribuem e mantêm os dados. Isso pode fazer com que os dados da aplicação de setores não seja tão confiável/segura para utilização. Seria necessário uma averiguação para verificar se os dados não estão desatualizados ou inconsistentes. Como a própria professora Luziane deu um exemplo que o local onde ela reside não está mapeado no openstreetmap.
Sendo assim, seria desejado que houvessem usuários ligados à aplicação e que ao mesmo tempo fizessem parte da comunidade voluntária de mapeadores, com o objetivo de garantir o controle de qualidade dos dados utilizados na aplicação. Futuramente é desejável a implementação de um serviço do tipo "Fale Conosco", na qual o usuário final da aplicação poderá enviar sugestões/melhorias/comentários para os desenvolvedores e/ou equipe que administra a mesma.
- Probabilidade: **Alta**
- Efeitos: **Sérios**

### Banco de dados não populado, ou populado incorretamente, por meio de falhas durante a integração com a API devido a complexidade de utilizar a mesma
O projeto em questão necessita que seu banco de dados seja populado por meio do site openstreetmap, gerando a necessidade dos desenvolvedores em aprender a utilizar tal API. Além do processo de aprendizado poder demandar, relativamente, bastante tempo, pode ocorrer também um mal entendimento da mesma gerando uma base de dados com ruídos dificultando a execução e a utilização da aplicação
- Probabilidade: **Média**
- Efeitos: **Gravíssimos**

### Usuário final não conseguir utilizar o sistema ou interpretar de forma errada os resultados devido a pouco conhecimento tecnológico
Na primeira etapa do projeto será planejada uma aplicação que não constará de visualização de mapeamento gráfico, ou seja, não terá um mapa personalizado de acordo com a necessidade da aplicação. Como o público alvo da aplicação são os moradores da cidade de Monte Carmelo na faixa etária de "Adultos/Idosos", pode ser que os mesmos não tenham tanto contato com tecnologia. Diante de tal situação, pode ocorrer de o usuário final não conseguir manusear a aplicação ou interpretar os resultados, caso este não tenha um conhecimento básico de tecnologia.
- Probabilidade: **Baixa**
- Efeitos: **Toleráveis**


### Usuário final não passar os dados necessários para o funcionamento das funções de cálculo de iptu
O projeto em questão necessita que o usuário final informe dados da sua residencia como : área de lote,área construida, entre outras informações para que o cálculo do iptu possa ser efetuado da maneira mais precisa, assim correspondendo a realidade. Como o público alvo da aplicação são os moradores da cidade de Monte Carmelo-MG, é possível que alguns usuários não se sintam confortáveis para informar esses dados, assim não sendo possível efetuar os cálculos para eles.
- Probabilidade: **Baixa**
- Efeitos: **Toleráveis**

### Valores calculados no aplicativo não condizente com a realidade da cidade
O projeto em questão tem como umas das principais funções e benefícios para o usuário o cálculo do iptu, água, energia, com isso há possibilidade de que o método realizado na prefeitura não condizente com o metodo padrão, assim os valores não vão ser aproximados entre si. Com isso pode gerar insatisfação do usuário final do aplicativo, mesmo não sendo um erro do aplicativo em si e sim da prefeitura.
- Probabilidade: **Baixa**
- Efeitos: **Sérios**

