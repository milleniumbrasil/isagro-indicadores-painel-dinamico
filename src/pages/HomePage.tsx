// src/pages/HomePage.tsx

import React, { useEffect } from 'react';
import $ from 'jquery';
import './HomePage.css';

const HomePage: React.FC = () => {
  useEffect(() => {
    // Carrega conteúdo externo apenas se os elementos não estiverem carregados
    if (!$('#barragov').children().length) {
      $("meta").load("/meta.html");
      $("#barragov").load("/barragov.html");
      $("#header").load("/header.html");
      $("#footer").load("/footer.html");
    }
  }, []);

  return (
    <>
      <meta charSet="utf-8" />
      <title>IS Agro</title>
      <link rel="stylesheet" href="/estilos.css" />
      <link rel="shortcut icon" href="/sgbfavicon.ico" />
      <script src="/jquery.js"></script>

      {/* Barra do Governo */}
      <div id="barragov">
        <div id="barra-brasil">
          <div className="conteudo-escondido">
            <a accessKey="1" href="#conteudo">Ir para o conteúdo</a>
          </div>
          <div className="conteudo-barra-brasil">
            {/* Inserir outras divs e navegações conforme o HTML */}
          </div>
          <div id="orgaos-governo-barra" className="orgaos-governo-barra">
            {/* Lista de órgãos governamentais */}
          </div>
        </div>
      </div>

      {/* Cabeçalho */}
      <div id="header">
        <header id="header1">
          <div className="barra_acess">
            <a href="https://www.sgb.gov.br/" target="_blank" title="Serviço Geológico do Brasil">
              <div id="logocprm"></div>
            </a>
            <div id="busca">
              <script async src="https://cse.google.com/cse.js?cx=10c79a2a330e36b93"></script>
              <div id="___gcse_0">
                {/* Inclusão de elementos de busca conforme o Google CSE */}
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Imagem de Banner */}
      <img src="/banner.png" style={{ width: '100%', marginTop: '59px' }} alt="Banner" />

      {/* Conteúdo Principal */}
      <div className="container resize">
        <section id="textohome">
            <div className="flex-container">
                <div className="flex-item-left">
                    <h1 className="resize">INTRODUÇÃO</h1>
                    <p className="resize">
                    O Brasil é um dos maiores produtores de alimentos e de matérias-primas de origem agrícola do mundo, apresentando ainda um grande potencial de crescimento.
                    </p>
                    <p className="resize">
                    Fóruns globais que avaliam a sustentabilidade da agricultura em âmbito mundial desconsideram que o país protagoniza, a partir da adoção de diferentes tecnologias, uma verdadeira revolução produtiva, baseada na adoção de sistemas sustentáveis de manejo do solo e na intensificação sustentável do uso da terra.
                    </p>
                    <p className="resize">
                    Para contrapor as posições desfavoráveis, o Brasil precisa estar munido de métricas e indicadores gerados a partir de dados técnico-científicos robustos capazes de avaliar o real desempenho de sua agropecuária, capacitando-se assim para negociar em defesa de seus interesses.
                    </p>
                </div>
                <div className="flex-item-right">
                    <h1 className="resize">PROJETO IS_AGRO</h1>
                    <p className="resize">
                    O projeto foi concebido para prover informações precisas e atualizadas sobre os indicadores ambientais e agrícolas, auxiliando na gestão sustentável e na defesa dos interesses do setor agrícola brasileiro no cenário internacional.
                    </p>
                    <img src="/card_indicadores_agricultura_organica.jpg" alt="Agricultura Orgânica" className="resize" />
                </div>
                </div>
                <div className="flex-container">
                <div className="flex-item-left">
                    <h1 className="resize">DESAFIOS</h1>
                    <p className="resize">
                    O desafio é conseguir medir e demonstrar o que é feito no Brasil em termos de sustentabilidade e uso responsável de recursos, de forma a contribuir positivamente para o debate global.
                    </p>
                </div>
                <div className="flex-item-right">
                    <h1 className="resize">AÇÕES ESTRATÉGICAS</h1>
                    <p className="resize">
                    O Brasil tem adotado sistemas de manejo que promovem a conservação de solo, a redução das emissões de gases de efeito estufa e o uso racional de recursos, resultando em uma agricultura mais sustentável.
                    </p>
                </div>
                </div>
                <div className="flex-container">
                <div className="flex-item-left">
                    <h1 className="resize">CONCLUSÃO</h1>
                    <p className="resize">
                    É essencial que o Brasil continue a investir em métricas e indicadores de sustentabilidade que reflitam os esforços e os resultados do setor agropecuário, de modo a fortalecer sua posição em fóruns internacionais.
                    </p>
                </div>
            </div>

          {/* Adicione o resto do conteúdo conforme a estrutura HTML */}
          <img src="/projeto1.png" alt="Projeto 1" />
          <img src="/projeto2.png" alt="Projeto 2" />
        </section>
      </div>
    </>
  );
};

export default HomePage;
