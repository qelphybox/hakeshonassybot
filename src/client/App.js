import React from 'react';
import TelegramLoginButton from 'react-telegram-login';
import {
  Columns, Container, Content, Footer, Heading, Hero,
} from 'react-bulma-components';
import WelcomeImage from './welcome.svg';
import config from './config';

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
                <div>
                  <TelegramLoginButton dataAuthUrl={`https://${config.DOMAIN}/`} botName={config.BOT_NAME}/>
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
