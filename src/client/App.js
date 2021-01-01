import React from 'react';
import 'react-bulma-components/src/index.sass';
import Footer from 'react-bulma-components/lib/components/footer';
import Container from 'react-bulma-components/lib/components/container';
import Content from 'react-bulma-components/lib/components/content';
import Hero from 'react-bulma-components/lib/components/hero';
import Heading from 'react-bulma-components/src/components/heading';
import Columns from 'react-bulma-components/src/components/columns';
import WelcomeImage from './welcome.svg';

function App() {
  return (
    <div>
      <Hero size="fullheight">
        <Hero.Head renderAs="header" />
        <Hero.Body>
          <Container>
            <Columns>
              <Columns.Column style={ { display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div>
                  <Heading size={1} renderAs="p" className="has-text-centered-mobile is-size-2-mobile">HakeShonassyBot</Heading>
                  <Heading subtitle renderAs="p" className="has-text-centered-mobile is-size-5-mobile">Телеграм бот раздающий глупые ачивки участникам чата</Heading>
                </div>
              </Columns.Column>
              <Columns.Column>
                <img src={WelcomeImage} alt='welcome image'/>
              </Columns.Column>
            </Columns>
          </Container>
        </Hero.Body>
        <Hero.Footer>
          <Footer>
            <Container>
              <Content style={{ textAlign: 'center' }}>
                <p>
                  <strong>HakeShonassyBot</strong> Исходный код лицензирован <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
                </p>
              </Content>
            </Container>
          </Footer>
        </Hero.Footer>
      </Hero>
    </div>
  );
}

export default App;
