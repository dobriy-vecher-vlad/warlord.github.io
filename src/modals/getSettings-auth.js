import React from 'react';
import {
	FormItem,
	Input,
	Div,
	ModalPageHeader,
	PanelHeaderSubmit,
	PanelHeaderBack,
	IconButton,
	ModalPage
} from '@vkontakte/vkui';
import {
	Icon16Clear
} from '@vkontakte/icons';

class MODAL extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			key: this.props.state.auth ? this.props.state.auth : ''
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
					right={<PanelHeaderSubmit disabled={String(key).length != 32} onClick={() => setState({ auth: key }, options.BackModal())}/>}
				>Ключ авторизации</ModalPageHeader>}
			>
				<Div>
					<FormItem
						top="Ключ авторизации игры" 
						status={String(key).length == 32 ? 'valid' : 'error'}
						bottom={String(key).length == 32 ? 'Ключ введён верно!' : 'Пожалуйста, введите ключ'}
					>
						<Input
							type="text"
							name="auth_key"
							placeholder="auth_key"
							maxLength={32}
							value={key}
							onChange={e => this.setState({ key: e.target.value })}
							after={<IconButton hoverMode="opacity" aria-label="Очистить поле" onClick={() => this.setState({ key: '' })}><Icon16Clear/></IconButton>}
						/>
					</FormItem>
				</Div>
			</ModalPage>
		);
	};
};
export default MODAL;