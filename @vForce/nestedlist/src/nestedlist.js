import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import imageIcon from '../theme/nestedlist.svg';
import '../theme/nestedList.css';

const nestedListSection = 'nestedlistsection';

export default class NestedList extends Plugin {
	init() {
		console.log( 'NestedList was initialized' );
		const editor = this.editor;
	
		editor.ui.componentFactory.add( 'nestedList', locale => {
			const view = new ButtonView( locale );

			view.set( {
					label: 'Insert Listed Sections',
					icon: imageIcon,
					tooltip: true
			} );

			view.on( 'execute', () => {
				this.editor.model.change( writer => {	
					const newNestedList = this.createNestedListSection( writer );
					this.editor.model.insertContent( newNestedList );

					writer.setSelection(
						writer.createRangeIn(newNestedList.getChild(0))
					);

				});
			} );

			return view;
		} );

		this.defineSchema();
		this.defineConverter();
	}

	defineSchema() {
		const schema = this.editor.model.schema;
		schema.register(nestedListSection, {
			isBlock: true,
			allowWhere: '$block',
			allowContentOf: '$root'
		});
	}

	defineConverter() {
		const conversion = this.editor.conversion;
		conversion.elementToElement( {
			model: 'nestedlistsection',
			view: {
					name: 'div',
					classes: 'nestedlist__section'
			}
	} );
	}

	createNestedListSection(writer) {
		const sectionElement = writer.createElement( nestedListSection );
		const sectionHeading = writer.createElement( 'heading2' );

		writer.appendText('First Heading; Add more with `Heading 2`', sectionHeading);
		writer.append(sectionHeading, sectionElement);

		return sectionElement;
	}
}