import React from 'react';
import ReactModal from 'react-modal';
import WebAudioFontPlayer from 'webaudiofont';

const STYLE = {
  MIDISoundsInfo: {
    height: '100%'
    , overflow: 'auto'
    , paddingRight: '3px'
    , textAlign: 'center'
  }
  , MIDISoundsClose: {
    textAlign: 'center'
    , borderTop: '1px solid silver'
  }
  , MIDISoundsClose2: {
    textAlign: 'right'
    , borderBottom: '1px solid silver'
  }
  , MIDISoundsEq2: {
    writingMode: 'bt-lr' /* IE */
    , WebkitAppearance: 'slider-vertical' /* WebKit */
    , width: '0.5cm'
    , height: '4cm'
    , padding: '0 5px'
    , WebkitTransform: [{ rotate: '270deg' }]
    , MozTransform: [{ rotate: '270deg' }]
    , transform: [{ rotate: '270deg' }]
  }
  , MIDISoundsEq: {

  }
  , MIDISoundsVl: {

  }
  , centerTable: {
    margin: '0px auto'
  }
  , tdOn: {
    backgroundColor: 'rgb(111,145,124)'
    , width: '0.5cm'
    , height: '0.5cm'
  }
  , tdOff: {
    backgroundColor: 'rgb(224,224,224)'
    , width: '0.5cm'
    , height: '0.5cm'
  }
  , eqOn: {
    backgroundColor: 'rgb(111,145,124)'
    , width: '0.5cm'
    , height: '0.2cm'
    , fontSize: '30%'
    , color: '#ffffff'
  }
  , eqOff: {
    backgroundColor: 'rgb(224,224,224)'
    , width: '0.5cm'
    , height: '0.2cm'
  }
};
class MIDISounds extends React.Component {
  constructor(props) {
    super(props);
    console.log('MIDISounds v1.2.48');
    this.state = {
      showModal: false
      , appElementName: this.props.appElementName
      , instruments: this.props.instruments
      , drums: this.props.drums
      , master: 1.0
      , echo: 0.5
      , q32: 0
      , q64: 0
      , q128: 0
      , q256: 0
      , q512: 0
      , q1k: 0
      , q2k: 0
      , q4k: 0
      , q8k: 0
      , q16k: 0
    };
    if (this.props.appElementName) {
      ReactModal.setAppElement('#' + this.props.appElementName);
    }
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.midiStatus = "?";
    this.initAudio();
  }
  render() {
    this.refreshCache();
    var r = (
      <div className="MIDISounds">
        <div style={{width: '32px'}} onClick={this.handleOpenModal}>
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 59 59" style={{enableBackground:'new 0 0 59 59'}} xmlSpace="preserve">
          <g>
	          <path d="M8,42.58V3.5c0-0.553-0.447-1-1-1s-1,0.447-1,1v39.08c-3.386,0.488-6,3.401-6,6.92c0,3.859,3.141,7,7,7s7-3.141,7-7
		C14,45.981,11.386,43.068,8,42.58z M7,54.5c-2.757,0-5-2.243-5-5s2.243-5,5-5s5,2.243,5,5S9.757,54.5,7,54.5z"/>
	<path d="M23,30.58V3.5c0-0.553-0.447-1-1-1s-1,0.447-1,1v27.08c-3.386,0.488-6,3.401-6,6.92s2.614,6.432,6,6.92V55.5
		c0,0.553,0.447,1,1,1s1-0.447,1-1V44.42c3.386-0.488,6-3.401,6-6.92S26.386,31.068,23,30.58z M22,42.5c-2.757,0-5-2.243-5-5
		s2.243-5,5-5s5,2.243,5,5S24.757,42.5,22,42.5z"/>
	<path d="M38,18.58V3.5c0-0.553-0.447-1-1-1s-1,0.447-1,1v15.08c-3.386,0.488-6,3.401-6,6.92s2.614,6.432,6,6.92V55.5
		c0,0.553,0.447,1,1,1s1-0.447,1-1V32.42c3.386-0.488,6-3.401,6-6.92S41.386,19.068,38,18.58z M37,30.5c-2.757,0-5-2.243-5-5
		s2.243-5,5-5s5,2.243,5,5S39.757,30.5,37,30.5z"/>
	<path d="M59,13.5c0-3.519-2.614-6.432-6-6.92V3.5c0-0.553-0.447-1-1-1s-1,0.447-1,1v3.08c-3.386,0.488-6,3.401-6,6.92
		s2.614,6.432,6,6.92V55.5c0,0.553,0.447,1,1,1s1-0.447,1-1V20.42C56.386,19.932,59,17.019,59,13.5z M52,18.5c-2.757,0-5-2.243-5-5
		s2.243-5,5-5s5,2.243,5,5S54.757,18.5,52,18.5z"/>
	<path d="M53,10.5h-2c-0.553,0-1,0.447-1,1s0.447,1,1,1h2c0.553,0,1-0.447,1-1S53.553,10.5,53,10.5z"/>
	<path d="M38,22.5h-2c-0.553,0-1,0.447-1,1s0.447,1,1,1h2c0.553,0,1-0.447,1-1S38.553,22.5,38,22.5z"/>
	<path d="M38,26.5h-2c-0.553,0-1,0.447-1,1s0.447,1,1,1h2c0.553,0,1-0.447,1-1S38.553,26.5,38,26.5z"/>
	<path d="M23,34.5h-2c-0.553,0-1,0.447-1,1s0.447,1,1,1h2c0.553,0,1-0.447,1-1S23.553,34.5,23,34.5z"/>
	<path d="M23,38.5h-2c-0.553,0-1,0.447-1,1s0.447,1,1,1h2c0.553,0,1-0.447,1-1S23.553,38.5,23,38.5z"/>
	<path d="M8,46.5H6c-0.553,0-1,0.447-1,1s0.447,1,1,1h2c0.553,0,1-0.447,1-1S8.553,46.5,8,46.5z"/>
	<path d="M8,50.5H6c-0.553,0-1,0.447-1,1s0.447,1,1,1h2c0.553,0,1-0.447,1-1S8.553,50.5,8,50.5z"/>
	<path d="M53,14.5h-2c-0.553,0-1,0.447-1,1s0.447,1,1,1h2c0.553,0,1-0.447,1-1S53.553,14.5,53,14.5z"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
        </div>
        <ReactModal isOpen={this.state.showModal} contentLabel="MIDISounds options" shouldCloseOnOverlayClick={true} onRequestClose={this.handleCloseModal}>
          <div style={STYLE.MIDISoundsInfo}>

            <p>Echo level {Math.round(this.state.echo * 100)}%</p>
            <table style={STYLE.centerTable}>
              <tbody>
                <tr>
                  <td style={STYLE.tdOn} onClick={(e) => this.setEchoLevel(0 / 9)}></td>
                  <td style={this.state.echo < 1 / 9 ? STYLE.tdOff : STYLE.tdOn} onClick={(e) => this.setEchoLevel(1 / 9)}></td>
                  <td style={this.state.echo < 2 / 9 ? STYLE.tdOff : STYLE.tdOn} onClick={(e) => this.setEchoLevel(2 / 9)}></td>
                  <td style={this.state.echo < 3 / 9 ? STYLE.tdOff : STYLE.tdOn} onClick={(e) => this.setEchoLevel(3 / 9)}></td>
                  <td style={this.state.echo < 4 / 9 ? STYLE.tdOff : STYLE.tdOn} onClick={(e) => this.setEchoLevel(4 / 9)}></td>
                  <td style={this.state.echo < 5 / 9 ? STYLE.tdOff : STYLE.tdOn} onClick={(e) => this.setEchoLevel(5 / 9)}></td>
                  <td style={this.state.echo < 6 / 9 ? STYLE.tdOff : STYLE.tdOn} onClick={(e) => this.setEchoLevel(6 / 9)}></td>
                  <td style={this.state.echo < 7 / 9 ? STYLE.tdOff : STYLE.tdOn} onClick={(e) => this.setEchoLevel(7 / 9)}></td>
                  <td style={this.state.echo < 8 / 9 ? STYLE.tdOff : STYLE.tdOn} onClick={(e) => this.setEchoLevel(8 / 9)}></td>
                  <td style={this.state.echo < 9 / 9 ? STYLE.tdOff : STYLE.tdOn} onClick={(e) => this.setEchoLevel(9 / 9)}></td>
                </tr>
              </tbody>
            </table>
            <p>Equalizer</p>
            <table style={STYLE.centerTable}>
              <tbody>
                <tr>
                  <td style={this.state.q32 > 9 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand32(10)}></td>
                  <td style={this.state.q64 > 9 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand64(10)}></td>
                  <td style={this.state.q128 > 9 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand128(10)}></td>
                  <td style={this.state.q256 > 9 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand256(10)}></td>
                  <td style={this.state.q512 > 9 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand512(10)}></td>
                  <td style={this.state.q1k > 9 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand1k(10)}></td>
                  <td style={this.state.q2k > 9 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand2k(10)}></td>
                  <td style={this.state.q4k > 9 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand4k(10)}></td>
                  <td style={this.state.q8k > 9 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand8k(10)}></td>
                  <td style={this.state.q16k > 9 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand16k(10)}></td>
                </tr>
                <tr>
                  <td style={this.state.q32 > 8 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand32(9)}></td>
                  <td style={this.state.q64 > 8 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand64(9)}></td>
                  <td style={this.state.q128 > 8 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand128(9)}></td>
                  <td style={this.state.q256 > 8 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand256(9)}></td>
                  <td style={this.state.q512 > 8 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand512(9)}></td>
                  <td style={this.state.q1k > 8 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand1k(9)}></td>
                  <td style={this.state.q2k > 8 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand2k(9)}></td>
                  <td style={this.state.q4k > 8 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand4k(9)}></td>
                  <td style={this.state.q8k > 8 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand8k(9)}></td>
                  <td style={this.state.q16k > 8 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand16k(9)}></td>
                </tr>
                <tr>
                  <td style={this.state.q32 > 7 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand32(8)}></td>
                  <td style={this.state.q64 > 7 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand64(8)}></td>
                  <td style={this.state.q128 > 7 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand128(8)}></td>
                  <td style={this.state.q256 > 7 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand256(8)}></td>
                  <td style={this.state.q512 > 7 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand512(8)}></td>
                  <td style={this.state.q1k > 7 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand1k(8)}></td>
                  <td style={this.state.q2k > 7 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand2k(8)}></td>
                  <td style={this.state.q4k > 7 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand4k(8)}></td>
                  <td style={this.state.q8k > 7 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand8k(8)}></td>
                  <td style={this.state.q16k > 7 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand16k(8)}></td>
                </tr>
                <tr>
                  <td style={this.state.q32 > 6 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand32(7)}></td>
                  <td style={this.state.q64 > 6 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand64(7)}></td>
                  <td style={this.state.q128 > 6 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand128(7)}></td>
                  <td style={this.state.q256 > 6 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand256(7)}></td>
                  <td style={this.state.q512 > 6 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand512(7)}></td>
                  <td style={this.state.q1k > 6 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand1k(7)}></td>
                  <td style={this.state.q2k > 6 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand2k(7)}></td>
                  <td style={this.state.q4k > 6 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand4k(7)}></td>
                  <td style={this.state.q8k > 6 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand8k(7)}></td>
                  <td style={this.state.q16k > 6 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand16k(7)}></td>
                </tr>
                <tr>
                  <td style={this.state.q32 > 5 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand32(6)}></td>
                  <td style={this.state.q64 > 5 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand64(6)}></td>
                  <td style={this.state.q128 > 5 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand128(6)}></td>
                  <td style={this.state.q256 > 5 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand256(6)}></td>
                  <td style={this.state.q512 > 5 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand512(6)}></td>
                  <td style={this.state.q1k > 5 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand1k(6)}></td>
                  <td style={this.state.q2k > 5 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand2k(6)}></td>
                  <td style={this.state.q4k > 5 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand4k(6)}></td>
                  <td style={this.state.q8k > 5 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand8k(6)}></td>
                  <td style={this.state.q16k > 5 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand16k(6)}></td>
                </tr>
                <tr>
                  <td style={this.state.q32 > 4 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand32(5)}></td>
                  <td style={this.state.q64 > 4 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand64(5)}></td>
                  <td style={this.state.q128 > 4 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand128(5)}></td>
                  <td style={this.state.q256 > 4 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand256(5)}></td>
                  <td style={this.state.q512 > 4 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand512(5)}></td>
                  <td style={this.state.q1k > 4 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand1k(5)}></td>
                  <td style={this.state.q2k > 4 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand2k(5)}></td>
                  <td style={this.state.q4k > 4 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand4k(5)}></td>
                  <td style={this.state.q8k > 4 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand8k(5)}></td>
                  <td style={this.state.q16k > 4 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand16k(5)}></td>
                </tr>
                <tr>
                  <td style={this.state.q32 > 3 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand32(4)}></td>
                  <td style={this.state.q64 > 3 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand64(4)}></td>
                  <td style={this.state.q128 > 3 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand128(4)}></td>
                  <td style={this.state.q256 > 3 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand256(4)}></td>
                  <td style={this.state.q512 > 3 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand512(4)}></td>
                  <td style={this.state.q1k > 3 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand1k(4)}></td>
                  <td style={this.state.q2k > 3 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand2k(4)}></td>
                  <td style={this.state.q4k > 3 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand4k(4)}></td>
                  <td style={this.state.q8k > 3 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand8k(4)}></td>
                  <td style={this.state.q16k > 3 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand16k(4)}></td>
                </tr>
                <tr>
                  <td style={this.state.q32 > 2 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand32(3)}></td>
                  <td style={this.state.q64 > 2 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand64(3)}></td>
                  <td style={this.state.q128 > 2 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand128(3)}></td>
                  <td style={this.state.q256 > 2 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand256(3)}></td>
                  <td style={this.state.q512 > 2 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand512(3)}></td>
                  <td style={this.state.q1k > 2 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand1k(3)}></td>
                  <td style={this.state.q2k > 2 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand2k(3)}></td>
                  <td style={this.state.q4k > 2 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand4k(3)}></td>
                  <td style={this.state.q8k > 2 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand8k(3)}></td>
                  <td style={this.state.q16k > 2 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand16k(3)}></td>
                </tr>
                <tr>
                  <td style={this.state.q32 > 1 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand32(2)}></td>
                  <td style={this.state.q64 > 1 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand64(2)}></td>
                  <td style={this.state.q128 > 1 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand128(2)}></td>
                  <td style={this.state.q256 > 1 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand256(2)}></td>
                  <td style={this.state.q512 > 1 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand512(2)}></td>
                  <td style={this.state.q1k > 1 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand1k(2)}></td>
                  <td style={this.state.q2k > 1 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand2k(2)}></td>
                  <td style={this.state.q4k > 1 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand4k(2)}></td>
                  <td style={this.state.q8k > 1 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand8k(2)}></td>
                  <td style={this.state.q16k > 1 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand16k(2)}></td>
                </tr>
                <tr>
                  <td style={this.state.q32 > 0 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand32(1)}></td>
                  <td style={this.state.q64 > 0 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand64(1)}></td>
                  <td style={this.state.q128 > 0 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand128(1)}></td>
                  <td style={this.state.q256 > 0 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand256(1)}></td>
                  <td style={this.state.q512 > 0 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand512(1)}></td>
                  <td style={this.state.q1k > 0 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand1k(1)}></td>
                  <td style={this.state.q2k > 0 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand2k(1)}></td>
                  <td style={this.state.q4k > 0 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand4k(1)}></td>
                  <td style={this.state.q8k > 0 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand8k(1)}></td>
                  <td style={this.state.q16k > 0 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand16k(1)}></td>
                </tr>

                <tr>
                  <td style={STYLE.eqOn} onClick={(e) => this.setBand32(0)}>32</td>
                  <td style={STYLE.eqOn} onClick={(e) => this.setBand64(0)}>64</td>
                  <td style={STYLE.eqOn} onClick={(e) => this.setBand128(0)}>128</td>
                  <td style={STYLE.eqOn} onClick={(e) => this.setBand256(0)}>256</td>
                  <td style={STYLE.eqOn} onClick={(e) => this.setBand512(0)}>512</td>
                  <td style={STYLE.eqOn} onClick={(e) => this.setBand1k(0)}>1k</td>
                  <td style={STYLE.eqOn} onClick={(e) => this.setBand2k(0)}>2k</td>
                  <td style={STYLE.eqOn} onClick={(e) => this.setBand4k(0)}>4k</td>
                  <td style={STYLE.eqOn} onClick={(e) => this.setBand8k(0)}>8k</td>
                  <td style={STYLE.eqOn} onClick={(e) => this.setBand16k(0)}>16k</td>
                </tr>
                <tr>
                  <td style={this.state.q32 < -0 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand32(-1)}></td>
                  <td style={this.state.q64 < -0 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand64(-1)}></td>
                  <td style={this.state.q128 < -0 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand128(-1)}></td>
                  <td style={this.state.q256 < -0 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand256(-1)}></td>
                  <td style={this.state.q512 < -0 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand512(-1)}></td>
                  <td style={this.state.q1k < -0 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand1k(-1)}></td>
                  <td style={this.state.q2k < -0 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand2k(-1)}></td>
                  <td style={this.state.q4k < -0 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand4k(-1)}></td>
                  <td style={this.state.q8k < -0 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand8k(-1)}></td>
                  <td style={this.state.q16k < -0 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand16k(-1)}></td>
                </tr>
                <tr>
                  <td style={this.state.q32 < -1 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand32(-2)}></td>
                  <td style={this.state.q64 < -1 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand64(-2)}></td>
                  <td style={this.state.q128 < -1 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand128(-2)}></td>
                  <td style={this.state.q256 < -1 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand256(-2)}></td>
                  <td style={this.state.q512 < -1 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand512(-2)}></td>
                  <td style={this.state.q1k < -1 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand1k(-2)}></td>
                  <td style={this.state.q2k < -1 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand2k(-2)}></td>
                  <td style={this.state.q4k < -1 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand4k(-2)}></td>
                  <td style={this.state.q8k < -1 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand8k(-2)}></td>
                  <td style={this.state.q16k < -1 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand16k(-2)}></td>
                </tr>
                <tr>
                  <td style={this.state.q32 < -2 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand32(-3)}></td>
                  <td style={this.state.q64 < -2 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand64(-3)}></td>
                  <td style={this.state.q128 < -2 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand128(-3)}></td>
                  <td style={this.state.q256 < -2 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand256(-3)}></td>
                  <td style={this.state.q512 < -2 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand512(-3)}></td>
                  <td style={this.state.q1k < -2 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand1k(-3)}></td>
                  <td style={this.state.q2k < -2 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand2k(-3)}></td>
                  <td style={this.state.q4k < -2 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand4k(-3)}></td>
                  <td style={this.state.q8k < -2 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand8k(-3)}></td>
                  <td style={this.state.q16k < -2 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand16k(-3)}></td>
                </tr>
                <tr>
                  <td style={this.state.q32 < -3 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand32(-4)}></td>
                  <td style={this.state.q64 < -3 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand64(-4)}></td>
                  <td style={this.state.q128 < -3 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand128(-4)}></td>
                  <td style={this.state.q256 < -3 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand256(-4)}></td>
                  <td style={this.state.q512 < -3 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand512(-4)}></td>
                  <td style={this.state.q1k < -3 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand1k(-4)}></td>
                  <td style={this.state.q2k < -3 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand2k(-4)}></td>
                  <td style={this.state.q4k < -3 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand4k(-4)}></td>
                  <td style={this.state.q8k < -3 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand8k(-4)}></td>
                  <td style={this.state.q16k < -3 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand16k(-4)}></td>
                </tr>
                <tr>
                  <td style={this.state.q32 < -4 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand32(-5)}></td>
                  <td style={this.state.q64 < -4 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand64(-5)}></td>
                  <td style={this.state.q128 < -4 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand128(-5)}></td>
                  <td style={this.state.q256 < -4 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand256(-5)}></td>
                  <td style={this.state.q512 < -4 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand512(-5)}></td>
                  <td style={this.state.q1k < -4 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand1k(-5)}></td>
                  <td style={this.state.q2k < -4 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand2k(-5)}></td>
                  <td style={this.state.q4k < -4 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand4k(-5)}></td>
                  <td style={this.state.q8k < -4 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand8k(-5)}></td>
                  <td style={this.state.q16k < -4 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand16k(-5)}></td>
                </tr>
                <tr>
                  <td style={this.state.q32 < -5 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand32(-6)}></td>
                  <td style={this.state.q64 < -5 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand64(-6)}></td>
                  <td style={this.state.q128 < -5 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand128(-6)}></td>
                  <td style={this.state.q256 < -5 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand256(-6)}></td>
                  <td style={this.state.q512 < -5 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand512(-6)}></td>
                  <td style={this.state.q1k < -5 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand1k(-6)}></td>
                  <td style={this.state.q2k < -5 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand2k(-6)}></td>
                  <td style={this.state.q4k < -5 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand4k(-6)}></td>
                  <td style={this.state.q8k < -5 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand8k(-6)}></td>
                  <td style={this.state.q16k < -5 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand16k(-6)}></td>
                </tr>
                <tr>
                  <td style={this.state.q32 < -6 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand32(-7)}></td>
                  <td style={this.state.q64 < -6 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand64(-7)}></td>
                  <td style={this.state.q128 < -6 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand128(-7)}></td>
                  <td style={this.state.q256 < -6 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand256(-7)}></td>
                  <td style={this.state.q512 < -6 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand512(-7)}></td>
                  <td style={this.state.q1k < -6 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand1k(-7)}></td>
                  <td style={this.state.q2k < -6 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand2k(-7)}></td>
                  <td style={this.state.q4k < -6 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand4k(-7)}></td>
                  <td style={this.state.q8k < -6 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand8k(-7)}></td>
                  <td style={this.state.q16k < -6 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand16k(-7)}></td>
                </tr>
                <tr>
                  <td style={this.state.q32 < -7 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand32(-8)}></td>
                  <td style={this.state.q64 < -7 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand64(-8)}></td>
                  <td style={this.state.q128 < -7 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand128(-8)}></td>
                  <td style={this.state.q256 < -7 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand256(-8)}></td>
                  <td style={this.state.q512 < -7 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand512(-8)}></td>
                  <td style={this.state.q1k < -7 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand1k(-8)}></td>
                  <td style={this.state.q2k < -7 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand2k(-8)}></td>
                  <td style={this.state.q4k < -7 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand4k(-8)}></td>
                  <td style={this.state.q8k < -7 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand8k(-8)}></td>
                  <td style={this.state.q16k < -7 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand16k(-8)}></td>
                </tr>
                <tr>
                  <td style={this.state.q32 < -8 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand32(-9)}></td>
                  <td style={this.state.q64 < -8 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand64(-9)}></td>
                  <td style={this.state.q128 < -8 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand128(-9)}></td>
                  <td style={this.state.q256 < -8 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand256(-9)}></td>
                  <td style={this.state.q512 < -8 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand512(-9)}></td>
                  <td style={this.state.q1k < -8 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand1k(-9)}></td>
                  <td style={this.state.q2k < -8 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand2k(-9)}></td>
                  <td style={this.state.q4k < -8 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand4k(-9)}></td>
                  <td style={this.state.q8k < -8 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand8k(-9)}></td>
                  <td style={this.state.q16k < -8 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand16k(-9)}></td>
                </tr>
                <tr>
                  <td style={this.state.q32 < -9 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand32(-10)}></td>
                  <td style={this.state.q64 < -9 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand64(-10)}></td>
                  <td style={this.state.q128 < -9 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand128(-10)}></td>
                  <td style={this.state.q256 < -9 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand256(-10)}></td>
                  <td style={this.state.q512 < -9 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand512(-10)}></td>
                  <td style={this.state.q1k < -9 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand1k(-10)}></td>
                  <td style={this.state.q2k < -9 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand2k(-10)}></td>
                  <td style={this.state.q4k < -9 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand4k(-10)}></td>
                  <td style={this.state.q8k < -9 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand8k(-10)}></td>
                  <td style={this.state.q16k < -9 ? STYLE.eqOn : STYLE.eqOff} onClick={(e) => this.setBand16k(-10)}></td>
                </tr>
              </tbody>
            </table>

            <p>
              <button onClick={this.onSetPower.bind(this)}>Power</button>
              <button onClick={this.onSetDance.bind(this)}>Dance</button>
              <button onClick={this.onSetNone.bind(this)}>Flat</button>
              &nbsp;&nbsp;&nbsp;
			  <button onClick={this.handleCloseModal}>Close</button>
            </p>
          </div>
        </ReactModal>
      </div>
    );
    return r;
  }
  contextTime() {
    return this.audioContext.currentTime;
  }
  onSetNone() {
    this.setBand32(0);
    this.setBand64(0);
    this.setBand128(0);
    this.setBand256(0);
    this.setBand512(0);
    this.setBand1k(0);
    this.setBand2k(0);
    this.setBand4k(0);
    this.setBand8k(0);
    this.setBand16k(0);
  }
  onSetDance() {
    this.setBand32(2);
    this.setBand64(2);
    this.setBand128(1);
    this.setBand256(-1);
    this.setBand512(5);
    this.setBand1k(4);
    this.setBand2k(4);
    this.setBand4k(2);
    this.setBand8k(-2);
    this.setBand16k(3);
  }
  onSetPower() {
    this.setBand32(2);
    this.setBand64(4);
    this.setBand128(3);
    this.setBand256(-2);
    this.setBand512(-3);
    this.setBand1k(1);
    this.setBand2k(2);
    this.setBand4k(3);
    this.setBand8k(-3);
    this.setBand16k(1);
  }
  onChangeMaster(e) {
    let n = e.target.value;
    this.setMasterVolume(n);
  }
  onChangeEcho(e) {
    let n = e.target.value;
    this.setEchoLevel(n);
  }
  onChangeQ32(e) {
    let n = e.target.value;
    this.setBand32(n);
  }
  onChangeQ64(e) {
    let n = e.target.value;
    this.setBand64(n);
  }
  onChangeQ128(e) {
    let n = e.target.value;
    this.setBand128(n);
  }
  onChangeQ256(e) {
    let n = e.target.value;
    this.setBand256(n);
  }
  onChangeQ512(e) {
    let n = e.target.value;
    this.setBand512(n);
  }
  onChangeQ1k(e) {
    let n = e.target.value;
    this.setBand1k(n);
  }
  onChangeQ2k(e) {
    let n = e.target.value;
    this.setBand2k(n);
  }
  onChangeQ4k(e) {
    let n = e.target.value;
    this.setBand4k(n);
  }
  onChangeQ8k(e) {
    let n = e.target.value;
    this.setBand8k(n);
  }
  onChangeQ16k(e) {
    let n = e.target.value;
    this.setBand16k(n);
  }
  refreshCache() {
    if (this.state.instruments) {
      for (var i = 0; i < this.state.instruments.length; i++) {
        this.cacheInstrument(this.state.instruments[i]);
      }
    }
    if (this.state.drums) {
      for (var k = 0; k < this.state.drums.length; k++) {
        this.cacheDrum(this.state.drums[k]);
      }
    }
  }
  getProperties() {
    return {
      master: this.echo.output.gain.value * 1
    };
  }
  showPropertiesDialog() {
    this.handleOpenModal();
  }
  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }
  initAudio() {
    console.log('initAudio M♩D♩Sounds');
    if (this.player) {
      if (this.audioContext) {
        this.player.cancelQueue(this.audioContext);
      }
    }
    var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextFunc();
    this.destination = this.audioContext.destination;
    this.player = new WebAudioFontPlayer();
    this.equalizer = this.player.createChannel(this.audioContext);
    this.output = this.audioContext.createGain();
    this.echo = this.player.createReverberator(this.audioContext);
    this.echo.wet.gain.setTargetAtTime(this.state.echo, 0, 0.0001);
    this.echo.output.connect(this.output);
    this.equalizer.output.connect(this.echo.input);
    this.output.connect(this.destination);
    this.volumesInstrument = [];
    this.volumesDrum = [];
    this.midiNotes = [];
  }
  cacheInstrument(n) {
    var info = this.player.loader.instrumentInfo(n);
    if (window[info.variable]) {
      return;
    }
    this.player.loader.startLoad(this.audioContext, info.url, info.variable);
    this.player.loader.waitLoad(function () {
      console.log('cached', n, info.title);
    });
  }
  cacheDrum(n) {
    var info = this.player.loader.drumInfo(n);
    if (window[info.variable]) {
      return;
    }
    this.player.loader.startLoad(this.audioContext, info.url, info.variable);
    this.player.loader.waitLoad(function () {
      console.log('cached', n, info.title);
    });
  }
  playDrum(when, drum) {
    var info = this.player.loader.drumInfo(drum);
    if (window[info.variable]) {
      var pitch = window[info.variable].zones[0].keyRangeLow;
      var volume = this.volumeDrumAdjust(drum);
      this.player.queueWaveTable(this.audioContext, this.equalizer.input, window[info.variable], when, pitch, 3, volume);
    } else {
      this.cacheDrum(drum);
    }
  }
  playDrumsAt(when, drums) {
    for (var i = 0; i < drums.length; i++) {
      this.playDrum(when, drums[i]);
    }
  }
  volumeInstrumentAdjust(instrument) {
    if (!(this.volumesInstrument[instrument] === undefined)) {
      return this.volumesInstrument[instrument];
    }
    return 1;
  }
  volumeDrumAdjust(drum) {
    if (!(this.volumesDrum[drum] === undefined)) {
      return this.volumesDrum[drum];
    }
    return 1;
  }
  startPlayLoop(beats, bpm, density, fromBeat) {
    this.stopPlayLoop();
    this.loopStarted = true;
    var wholeNoteDuration = 4 * 60 / bpm;
    if (fromBeat < beats.length) {
      this.beatIndex = fromBeat;
    } else {
      this.beatIndex = 0;
    }
    this.playBeatAt(this.contextTime(), beats[this.beatIndex], bpm);
    var nextLoopTime = this.contextTime() + density * wholeNoteDuration;
    var me = this;
    this.loopIntervalID = setInterval(function () {
      if (me.contextTime() > nextLoopTime - density * wholeNoteDuration) {
        me.beatIndex++;
        if (me.beatIndex >= beats.length) {
          me.beatIndex = 0;
        }
        me.playBeatAt(nextLoopTime, beats[me.beatIndex], bpm);
        nextLoopTime = nextLoopTime + density * wholeNoteDuration;
      }
    }, 22);
  }
  stopPlayLoop() {
    this.loopStarted = false;
    clearInterval(this.loopIntervalID);
    this.cancelQueue();
  }
  cancelQueue() {
    this.player.cancelQueue(this.audioContext);
  }
  playBeatAt(when, beat, bpm) {
    this.playDrumsAt(when, beat[0]);
    var chords = beat[1];
    var N = 4 * 60 / bpm;
    for (var i = 0; i < chords.length; i++) {
      var chord = chords[i];
      var instrument = chord[0];
      var pitches = chord[1];
      var duration = chord[2];
      var kind = 0;
      if (chord.length > 3) {
        kind = chord[3];
      }
      if (kind === 1) {
        this.playStrumDownAt(when, instrument, pitches, duration * N);
      } else {
        if (kind === 2) {
          this.playStrumUpAt(when, instrument, pitches, duration * N);
        } else {
          if (kind === 3) {
            this.playSnapAt(when, instrument, pitches, duration * N);
          } else {
            this.playChordAt(when, instrument, pitches, duration * N);
          }
        }
      }
    }
  }
  playChordAt(when, instrument, pitches, duration) {
    var info = this.player.loader.instrumentInfo(instrument);
    if (window[info.variable]) {
      this.player.queueChord(this.audioContext, this.equalizer.input, window[info.variable], when, pitches, duration, this.volumeInstrumentAdjust(instrument));
    } else {
      this.cacheInstrument(instrument);
    }
  }
  playStrumUpAt(when, instrument, pitches, duration) {
    var info = this.player.loader.instrumentInfo(instrument);
    if (window[info.variable]) {
      this.player.queueStrumUp(this.audioContext, this.equalizer.input, window[info.variable], when, pitches, duration, this.volumeInstrumentAdjust(instrument));
    } else {
      this.cacheInstrument(instrument);
    }
  }
  playStrumDownAt(when, instrument, pitches, duration) {
    var info = this.player.loader.instrumentInfo(instrument);
    if (window[info.variable]) {
      this.player.queueStrumDown(this.audioContext, this.equalizer.input, window[info.variable], when, pitches, duration, this.volumeInstrumentAdjust(instrument));
    } else {
      this.cacheInstrument(instrument);
    }
  }
  playSnapAt(when, instrument, pitches, duration) {
    var info = this.player.loader.instrumentInfo(instrument);
    if (window[info.variable]) {
      this.player.queueSnap(this.audioContext, this.equalizer.input, window[info.variable], when, pitches, duration, this.volumeInstrumentAdjust(instrument));
    } else {
      this.cacheInstrument(instrument);
    }
  }
  midNoteOn(pitch, velocity) {
    this.midiNoteOff(pitch);
    if (this.miditone) {
      var envelope = this.player.queueWaveTable(this.audioContext, this.audioContext.destination, this.tone, 0, pitch, 123456789, velocity / 100);
      var note = {
        pitch: pitch,
        envelope: envelope
      };
      this.midiNotes.push(note);
    }
  }
  midiNoteOff(pitch) {
    for (var i = 0; i < this.midiNotes.length; i++) {
      if (this.midiNotes[i].pitch === pitch) {
        if (this.midiNotes[i].envelope) {
          this.midiNotes[i].envelope.cancel();
        }
        this.midiNotes.splice(i, 1);
        return;
      }
    }
  }
  midiOnMIDImessage(event) {
    var data = event.data;
    //var cmd = data[0] >> 4;
    //var channel = data[0] & 0xf;
    var type = data[0] & 0xf0;
    var pitch = data[1];
    var velocity = data[2];
    switch (type) {
      case 144:
        this.midNoteOn(pitch, velocity);
        //logKeys();
        break;
      case 128:
        this.midiNoteOff(pitch);
        //logKeys();
        break;
      default:
        break;
    }
  }
  midiOnStateChange(event) {
    console.log('midiOnStateChange', event);
    //msg.innerHTML = event.port.manufacturer + ' ' + event.port.name + ' ' + event.port.state;
  }
  requestMIDIAccessSuccess(midi) {
    var inputs = midi.inputs.values();
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      console.log('midi input', input);
      input.value.onmidimessage = this.midiOnMIDImessage;
    }
    midi.onstatechange = this.midiOnStateChange;
  }
  requestMIDIAccessFailure(e) {
    console.log('requestMIDIAccessFailure', e);
  }
  startMIDIInput() {
    if (navigator.requestMIDIAccess) {
      console.log('navigator.requestMIDIAccess ok');
      navigator.requestMIDIAccess().then(this.requestMIDIAccessSuccess, this.requestMIDIAccessFailure);
    } else {
      console.log('navigator.requestMIDIAccess undefined');
      //msg.innerHTML = 'navigator.requestMIDIAccess undefined';
    }
  }
  playDrumsNow(drums) {
    this.playDrumsAt(0, drums);
  }
  playChordNow(instrument, pitches, duration) {
    this.playChordAt(0, instrument, pitches, duration);
  }
  playStrumUpNow(instrument, pitches, duration) {
    this.playStrumUpAt(0, instrument, pitches, duration);
  }
  playStrumDownNow(instrument, pitches, duration) {
    this.playStrumDownAt(0, instrument, pitches, duration);
  }
  playSnapNow(instrument, pitches, duration) {
    this.playSnapAt(0, instrument, pitches, duration);
  }
  setMasterVolume(volume) {
    this.output.gain.setTargetAtTime(volume, 0, 0.0001);
    this.setState({
      master: volume
    });
  }
  setInstrumentVolume(instrument, volume) {
    this.volumesInstrument[instrument] = volume;
  }
  setDrumVolume(drum, volume) {
    this.volumesDrum[drum] = volume;
  }
  setEchoLevel(value) {
    this.echo.wet.gain.setTargetAtTime(value, 0, 0.0001);
    this.setState({
      echo: value
    });
  }
  setBand32(level) {
    this.equalizer.band32.gain.setTargetAtTime(level, 0, 0.0001);
    this.setState({
      q32: level
    });
  }
  setBand64(level) {
    this.equalizer.band64.gain.setTargetAtTime(level, 0, 0.0001);
    this.setState({
      q64: level
    });
  }
  setBand128(level) {
    this.equalizer.band128.gain.setTargetAtTime(level, 0, 0.0001);
    this.setState({
      q128: level
    });
  }
  setBand256(level) {
    this.equalizer.band256.gain.setTargetAtTime(level, 0, 0.0001);
    this.setState({
      q256: level
    });
  }
  setBand512(level) {
    this.equalizer.band512.gain.setTargetAtTime(level, 0, 0.0001);
    this.setState({
      q512: level
    });
  }
  setBand1k(level) {
    this.equalizer.band1k.gain.setTargetAtTime(level, 0, 0.0001);
    this.setState({
      q1k: level
    });
  }
  setBand2k(level) {
    this.equalizer.band2k.gain.setTargetAtTime(level, 0, 0.0001);
    this.setState({
      q2k: level
    });
  }
  setBand4k(level) {
    this.equalizer.band4k.gain.setTargetAtTime(level, 0, 0.0001);
    this.setState({
      q4k: level
    });
  }
  setBand8k(level) {
    this.equalizer.band8k.gain.setTargetAtTime(level, 0, 0.0001);
    this.setState({
      q8k: level
    });
  }
  setBand16k(level) {
    this.equalizer.band16k.gain.setTargetAtTime(level, 0, 0.0001);
    this.setState({
      q16k: level
    });
  }
  setKeyboardInstrument(n) {
    var info = this.player.loader.instrumentInfo(n);
    if (window[info.variable]) {
      this.miditone = window[info.variable];
      return;
    }
    this.player.loader.startLoad(this.audioContext, info.url, info.variable);
    this.player.loader.waitLoad(function () {
      console.log('cached', n, info.title);
      this.miditone = window[info.variable];
    });
  }
}

export default MIDISounds;
