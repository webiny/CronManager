import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;


class AddFrequencyModal extends Webiny.Ui.Component {

	constructor(props) {
		super(props);

		this.state = {
			error: false,
			extraData: {},
			validationResult: '',
			model: {
				name: '',
				mask: ''
			}
		};

		Webiny.Tools.Validator.addValidator('cronFrequency', (val) => {
			const api = new Webiny.Api.Endpoint('/entities/cron-manager/job-frequency');

			return api.post('validate', {mask: val}).then(ar => {

				if(!ar.getData().status){
					throw new Error('Invalid cron job pattern.');
				}else{
					this.setState({validationResult: ar.getData().frequency});

					return true;
				}

			});
		});

		this.bindMethods('show,hide');
	}

	hide() {
		this.refs.dialog.hide();
	}

	show() {
		this.refs.dialog.show();
	}

	render() {
		let error = null;

		if (this.state.error) {
			error = (
				<div className="alert alert-danger" role="alert">
					<span className="icon icon-cancel-circled"></span>
					<button type="button" className="close" data-dismiss="alert">
						<span aria-hidden="true">×</span>
					</button>
					<strong>Oh snap!</strong> {this.state.error}
				</div>
			);
		}

		const formProps = {
			ui: 'addFrequencyForm',
			api: '/entities/cron-manager/job-frequency',
			fields: 'id, name, mask',
			connectToRouter: true
		};

		return (
			<Ui.Modal.Dialog ref="dialog">
				<Ui.Modal.Header title="Add Frequency"/>
				<Ui.Modal.Body>
                    {error}
					<Ui.Form.ApiContainer {...formProps}>
						<Ui.Form.Form layout={false}>
							<fields>
								<Ui.Grid.Row>
									<Ui.Grid.Col all={12}>
										<Ui.Input label="Name" name="name" validate="required"/>
									</Ui.Grid.Col>
									<Ui.Grid.Col all={12}>
										<Ui.Input label="Mask" name="mask" validate="required,cronFrequency" description={this.state.validationResult} />
									</Ui.Grid.Col>
								</Ui.Grid.Row>
							</fields>
						</Ui.Form.Form>
					</Ui.Form.ApiContainer>
				</Ui.Modal.Body>
				<Ui.Modal.Footer>
					<Ui.Button type="secondary" label="Cancel" onClick={this.ui('addFrequencyModal:hide')}/>
					<Ui.Button type="primary" label="Add frequency" onClick={this.ui('addFrequencyForm:submit')}/>
				</Ui.Modal.Footer>
			</Ui.Modal.Dialog>
		);
	}
}

export default AddFrequencyModal;