import { FC } from 'react';
import { Container, Header, Content, Footer, Sidebar } from 'rsuite';
import { ICity } from '../charts/ICity';
import { ICountry } from '../charts/ICountry';
import { IState } from '../charts/IState';
import { useMenuContext } from './MenuContext';

interface PaperGEEProps {
    countries: ICountry[];
    states: IState[];
    cities: ICity[];
}

export function Loading() {
    return (
        <p>
            <i>Loading...</i>
        </p>
    );
}

const PaperGEE: FC<PaperGEEProps> = (props) => {
    // dados do servidor armazenados no contexto
    const { contextCountries } = useMenuContext();
    const { contextStates } = useMenuContext();
    const { contextCities } = useMenuContext();

    return (
        <div>
            <Container>
                <Header>Header</Header>
                <Container>
                    <Content>Content</Content>
                    <Sidebar>Sidebar</Sidebar>
                </Container>
                <Footer>Footer</Footer>
            </Container>
        </div>
    );
};

export default PaperGEE;
