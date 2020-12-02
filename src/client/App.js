import React from 'react';
import 'react-bulma-components/src/index.sass';
import Footer from 'react-bulma-components/lib/components/footer';
import Container from 'react-bulma-components/lib/components/container';
import Content from 'react-bulma-components/lib/components/content';
import Hero from 'react-bulma-components/lib/components/hero';
import Heading from 'react-bulma-components/src/components/heading';
import WelcomeImage from './welcome.svg';

function App() {
  return (
    <div>
      <Hero size="fullheight">
        <Hero.Head renderAs="header" />
        <Hero.Body>
          <Container style={ { display: 'flex' } }>
            <div style={ {
              display: 'flex', alignContent: 'center', justifyContent: 'center', flexDirection: 'column',
            } }>
              <Heading size={1} renderAs="p">HakeShonassyBot</Heading>
              <Heading subtitle renderAs="p">Телеграм бот раздающий глупые ачивки участникам чата</Heading>
            </div>
            <img src={WelcomeImage} alt='welcome image'/>
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
