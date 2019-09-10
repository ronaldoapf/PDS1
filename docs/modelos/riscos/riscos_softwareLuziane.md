# Análise de Riscos do Software proposto pela Profa. Luziane

### Falta de interesse das partes necessárias para a realização do projeto
O principal risco apresentado pelo projeto é a possível falta de interesse da população (futuros usuários) e também da prefeitura com o mesmo, pois a aplicação depende de dados bem específicos que devem ser informados por tais atores. Para que seja possível mapear os setores de um município é necessário uma base de dados com uma quantidade relevante de informações (como endereço, gasto mensal médio de água/energia, preço do aluguel, etc) que, neste caso, seriam inseridas pelos próprios usuários e também pela prefeitura.
- Probabilidade: **Alta**
- Efeitos: **Catastróficos**

### Resultado final ser diferente do esperado devido a complexidade de implementação da aplicação
Principalmente nos quesitos de manipulação de mapas, como permitir que o usuário visualize sua posição no mapa setorizado, garantir precisão dos setores no mapa, etc. Pode ser que o resultado não seja o esperado durante a fase inicial do projeto.
- Probabilidade: **Média**
- Efeitos: **Sérios**

### Demandar mais tempo que o estipulado
O projeto em questão apresenta vários casos de uso e possívelmente 3 perfis diferentes, podendo demandar bastante tempo tanto da equipe para implementar/testar a aplicação, quanto da professora Luziane para explicar como cada funcionalidade/perfil deve operar e quais são suas entradas e saídas.
- Probabilidade: **Alta**
- Efeitos: **Toleráveis**

### Falta de informações provenientes da prefeitura e usuário
O projeto em questão necessita de informações que são repassadas pela prefeitura e usuário para que seu funcionamento posso ocorrer, caso essas informações não sejam informadas ou sejam informadas incorretamente vai ocasionar um falha no ciclo de vida do sistema..
- Probabilidade: **Média**
- Efeitos: **Sérios**

### Falha na coleta de informação por meio do site openstreetmap 
O projeto em questão necessita que seu banco de dados seja populado por meio do site openstreetmap para que este entre em funcionamento, caso tenha falha na coleta das informações o sistema não vai conseguir popular o banco de dados, tornando assim sem uso para os usuários finais.
- Probabilidade: **Média**
- Efeitos: **Sérios**

### Usuário com dificuldade no uso do sistema 
O projeto em questão na primeira etapa será uma aplicação que não vai constar de visualização gráfica, com isso pode ocorrer de o usuário final do sistema não conseguir manusear a aplicação, caso este não tenha um conhecimento básico de tecnologia.
- Probabilidade: **Baixa**
- Efeitos: **Toleráveis**

### Necessário a ajuda dos usuários para que o banco de dados da aplicação em questão seja conciso
O projeto em questão pretende utilizar o site [openstreetmap](https://www.openstreetmap.org/about) para fazer a coleta de dados inicial. Esse projeto é desenvolvido por uma comunidade voluntária de mapeadores que contribuem e mantêm os dados. Isso pode fazer com que os dados dessa aplicação não seja tão confiável/segura para utilização. Seria necessário uma averiguação para a verificação se os dados não estão desatualizados. Como a própria professora Luziane deu um exemplo que o local onde ela reside não está mapeado. Sendo assim, seria necessário que o usuário entre com seus dados corretamente para que exista um afunilamento nas informaçõpes coletadas através do openstreetmap. 
- Probabilidade: **Alta**
- Efeitos: **Toleráveis**