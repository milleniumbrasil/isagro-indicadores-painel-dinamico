import { FC, useState } from 'react';

import 'rsuite/Drawer/styles/index.css';
import 'rsuite/Dropdown/styles/index.css';
import 'rsuite/Stack/styles/index.css';
import 'rsuite/Form/styles/index.css';
import 'rsuite/FormControl/styles/index.css';
import 'rsuite/FormControlLabel/styles/index.css';
import 'rsuite/FormErrorMessage/styles/index.css';
import 'rsuite/FormHelpText/styles/index.css';
import 'rsuite/FormGroup/styles/index.css';
import 'rsuite/SelectPicker/styles/index.css';
import { Drawer, ButtonToolbar, Button, Placeholder, Form, SelectPicker} from 'rsuite';

import { ICity } from '../charts/ICity';
import { ICountry } from '../charts/ICountry';
import { IState } from '../charts/IState';
import { useMenuContext } from './MenuContext';

interface MenuProps {
    countries: ICountry[];
    states: IState[];
    cities: ICity[];
}

const Menu: FC<MenuProps> = (props) => {

    const [backdrop, setBackdrop] = useState<boolean | "static">("static");
    const [open, setOpen] = useState(false);

      const countriesDropdown = [
        {label: 'Brasil', value: 'BR'},
        {label: 'França', value: 'FR'},
        {label: 'Estados Unidos', value: 'US'},
      ];

      const statesDropdown = [
        'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'
      ].map((item) => ({ label: item, value: item }));

      const citiesDropdown = [
        'Angra dos Reis', 'Anápolis', 'Aracaju', 'Arapiraca', 'Belo Horizonte', 'Belém', 'Blumenau', 'Boa Vista', 'Brasília', 'Campina Grande', 'Campinas', 'Campo Grande', 'Caruaru', 'Caxias do Sul', 'Contagem', 'Cuiabá', 'Curitiba', 'Dourados', 'Feira de Santana', 'Florianópolis', 'Fortaleza', 'Goiânia', 'Ilhéus', 'Imperatriz', 'Joinville', 'João Pessoa', 'Juazeiro do Norte', 'Juiz de Fora', 'Londrina', 'Macapá', 'Maceió', 'Manaus', 'Marabá', 'Maringá', 'Mossoró', 'Natal', 'Niterói', 'Olinda', 'Palmas', 'Parintins', 'Parnaíba', 'Pelotas', 'Porto Alegre', 'Porto Velho', 'Recife', 'Rio Branco', 'Rio de Janeiro', 'Rondonópolis', 'Salvador', 'Santarém', 'Santos', 'Sobral', 'São Luís', 'São Paulo', 'Teresina', 'Uberlândia', 'Vila Velha', 'Vitória'
      ].map((item) => ({ label: item, value: item }));

    const analysisDropdown = [
        {label: 'Erosões', value: 'erosão'},
        {label: 'GEE', value: 'GEE'},
        {label: 'NH3', value: 'NH3'},
        {label: 'NPK', value: 'NPK'},
        {label: 'Orgânicas', value: 'Orgânicas'},
        {label: 'Pesticidas', value: 'Pesticidas'},
        {label: 'Poluições', value: 'Poluições'}];

        const labelDropdown = [
            {label: 'Pastagem', value: 'pastagem'},
            {label: 'Cultura', value: 'cultura'},
            {label: 'Tecnologia 1', value: 'tecnologia1'},
            {label: 'Tecnologia 2', value: 'tecnologia2'},
            {label: 'Tecnologia 3', value: 'tecnologia3'},
            {label: 'Tecnologia 4', value: 'tecnologia4'},
            {label: 'Fertilizantes Químicos', value: 'fertilizantes químicos'},
            {label: 'Fertilizantes Orgânicos', value: 'fertilizantes orgânicos'},
            {label: 'Manejo de Esterco', value: 'manejo de esterco'},
            {label: 'Deposição de Extretas', value: 'deposição de extretas'},
            {label: 'Queimas de Resíduos de Culturas', value: 'queimas de resíduos de culturas'},
            {label: 'Dejetos Animais', value: 'dejetos animais'},
            {label: 'Deposição Atmosférica', value: 'deposição atmosférica'},
            {label: 'Fertilizantes Minerais', value: 'fertilizantes minerais'},
            {label: 'Fixação Biológica de Nitrogênio', value: 'fixação biológica de nitrogênio'},
            {label: 'Resíduos Culturais', value: 'resíduos culturais'},
            {label: 'Resíduos Industriais', value: 'resíduos industriais'},
            {label: 'Resíduos Urbanos', value: 'resíduos urbanos'},
            {label: 'Produção Carne Bovina', value: 'produção carne bovina'},
            {label: 'Produção Agrícola', value: 'produção agrícola'},
            {label: 'Área Agropecuária', value: 'área agropecuária'},
            {label: 'Grão', value: 'grão'},
            {label: 'Hortaliças', value: 'hortaliças'},
            {label: 'Fruticultura', value: 'fruticultura'},
            {label: 'Herbicidas', value: 'herbicidas'},
            {label: 'Fungicidas', value: 'fungicidas'},
            {label: 'Inseticidas', value: 'inseticitas'},
            {label: 'Outros', value: 'outros'},
            {label: 'Nitrato', value: 'nitrato'},
            {label: 'Fosfato', value: 'fosfato'},
            {label: 'Cations', value: 'cations'},
            {label: 'Ânions', value: 'anions'}
          ];

    const sourcesDropdown = [
        {label: 'Organização para a Cooperação e Desenvolvimento Econômico', value: 'OCDE'},
        {label: 'Instituto Agronômico de Campinas', value: 'IAC'},
        {label: 'Universidade de Brasília', value: 'UNB'}];

    return (
        <>
          <ButtonToolbar>
            <Button onClick={() => setOpen(true)}>Abrir</Button>
          </ButtonToolbar>
          <Drawer backdrop={backdrop} open={open} onClose={() => setOpen(false)}>
            <Drawer.Header>
              <Drawer.Title>Parâmetros de Consulta</Drawer.Title>
              <Drawer.Actions>
                <Button onClick={() => setOpen(false)} appearance="primary">
                  Fechar
                </Button>
              </Drawer.Actions>
            </Drawer.Header>
            <Drawer.Body>
              <Placeholder.Paragraph />
                    <Form fluid>
                        <Form.Group controlId="select-10">
                            <Form.ControlLabel>Análise</Form.ControlLabel>
                            <Form.Control name="select-analysis" data={analysisDropdown} accepter={SelectPicker} />
                        </Form.Group>
                        <Form.Group controlId="select-source">
                            <Form.ControlLabel>Fonte</Form.ControlLabel>
                            <Form.Control name="select-source" data={sourcesDropdown} accepter={SelectPicker} />
                        </Form.Group>
                        <Form.Group controlId="select-label">
                            <Form.ControlLabel>Rótulo</Form.ControlLabel>
                            <Form.Control name="select-label" data={labelDropdown} accepter={SelectPicker} />
                        </Form.Group>
                        <Form.Group controlId="select-countries">
                            <Form.ControlLabel>País</Form.ControlLabel>
                            <Form.Control name="select-countries" data={countriesDropdown} accepter={SelectPicker} />
                        </Form.Group>
                        <Form.Group controlId="select-states">
                            <Form.ControlLabel>Estado</Form.ControlLabel>
                            <Form.Control name="select-states" data={statesDropdown} accepter={SelectPicker} />
                        </Form.Group>
                        <Form.Group controlId="select-cities">
                            <Form.ControlLabel>Cidade</Form.ControlLabel>
                            <Form.Control name="select-cities" data={citiesDropdown} accepter={SelectPicker} />
                        </Form.Group>
                    </Form>
            </Drawer.Body>
          </Drawer>
        </>
    );
};

export default Menu;

