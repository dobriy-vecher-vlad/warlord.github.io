import React from 'react';
import {
	FormItem,
	Div,
	ModalPageHeader,
	PanelHeaderSubmit,
	PanelHeaderBack,
	Radio,
	ModalPage
} from '@vkontakte/vkui';

class MODAL extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			key: this.props.state.server ? this.props.state.server : 0
		};
	};
	async componentDidMount() {
		console.log('[MODAL] >', this.props.id);
	};
	render() {
		const { setState, state, options } = this.props;
		const { key } = this.state;
		return (
			<ModalPage
				id={this.props.id}
				header={<ModalPageHeader 
					left={<PanelHeaderBack onClick={() => options.BackModal()}/>}
					right={<PanelHeaderSubmit disabled={!(Number(key) > 0)} onClick={() => setState({ server: key }, options.BackModal())}/>}
				>Сервер</ModalPageHeader>}
			>
				<Div>
					<FormItem
						top="Игровой сервер профиля"
						status={Number(key) != 0 ? 'valid' : 'error'}
						bottom={Number(key) != 0 ? 'Сервер выбран верно!' : 'Пожалуйста, выберите сервер'}
					>
						<Radio name="type"
							defaultChecked={key == 1}
							onChange={() => this.setState({ key: 1 })}
						>Эрмун</Radio>
						<Radio name="type"
							defaultChecked={key == 2}
							onChange={() => this.setState({ key: 2 })}
						>Антарес</Radio>
					</FormItem>
				</Div>
			</ModalPage>
		);
	};
};
export default MODAL;