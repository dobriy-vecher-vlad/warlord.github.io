import React from 'react';
import {
	Title,
	Gradient,
	Button,
	Div,
	Avatar,
	ModalPage,
	Banner
} from '@vkontakte/vkui';

class MODAL extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	};
	async componentDidMount() {
		console.log('[MODAL] >', this.props.id);
	};
	shouldComponentUpdate() {
		return false;
	}
	render() {
		return (
			<ModalPage id={this.props.id}>
				<Div style={{padding: 0}}>
					<Gradient style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						textAlign: 'center',
						padding: 20,
					}}>
						<Title level="2" weight="medium">Акция</Title>
						<div style={{ marginTop: 8 }}>Две подписки по цене одной</div>
					</Gradient>
					<Banner
						before={<Avatar size={28} style={{ backgroundImage: 'linear-gradient(90deg, #ffb73d 0%, #ffa000 100%)' }}><span style={{ color: '#fff' }}>!</span></Avatar>}
						header="Правила акции"
						subheader={<React.Fragment>
							Приведи друга, который оформит подписку по твоей рекомендации и получи подписку себе сроком на 3 месяца совершенно бесплатно
						</React.Fragment>}
						actions={<Button mode="tertiary" hasHover={false} onClick={() => {this.props.options.Storage({key: 'promo_3', value: 'true'}); this.props.options.BackModal();}}>Понятно</Button>}
					/>
				</Div>
			</ModalPage>
		);
	};
};
export default MODAL;