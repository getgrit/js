---
title: EnzymeToRTL
---
# {{ page.title }}

Migrate to react testing library.

tags: 

```grit
language js

pattern Mount() {
    `$mount($comp)` as $mountComp where {
        $mount <: or { `mount`, `shallow` }
        ensureImportFrom(`render`, `"@testing-library/react"`)
        $mountComp => `render($comp)`
    }
}

pattern InputValue() {
    // This only works if the prop is 'value' not for others.
    `$inputFind.prop('value')` => `$inputFind.value`
}

pattern TextContent() {
    `$textFind.text()` => `$textFind.textContent`
}

pattern SimulateInput() {
    `$inputFind.simulate($type, $value)` as $simulate where {
        ensureImportFrom(`fireEvent`, `"@testing-library/react"`)
        $eventType = Identifier(name = s"${type}")
        $simulate => [
            `const selector = $inputFind`,
            `fireEvent.$eventType(selector, { target: { value: $value } });`
        ]
    }
}

predicate QuerySelector($value) {
    $value <: r"^([a-zA-Z0-9_-]*[#.])+[a-zA-Z0-9_.#-]*"
}

predicate SelectorRewrite($value, $locator, $compVar) {
    if (QuerySelector($value)) {
        $locator => `querySelector`
    } else {
        ensureImportFrom(`screen`, `"@testing-library/react"`)
        $compVar => `screen`
        $locator => `getByRole`
    }
}

pattern RewriteSelector() {
    `$compVar.$locator($selector)` where {
        $locator <: `find`
        if ($selector <: StringLiteral(value=$value)) {
            // Regex to see if it's a query selector
            SelectorRewrite($value, $locator, $compVar)
            $value <: s"input\\[name=${formField}\\]" where {
                $selector => ["textbox", ObjectExpression(properties=[
                   ObjectProperty(key=Identifier(name="name"), value=raw($formField))
                ])]
            }
        } else {
            // If the variable used in the selector has a classname assigned rewrite it
            $program <: contains VariableDeclaration() as $var where {
                $var <: contains `$selector = $varSelector` where {
                    $varSelector <: StringLiteral(value=$value)
                    SelectorRewrite($value, $locator, $compVar)
                }
            }
        }
    }
}
 
or {
    Mount()
    RewriteSelector()
    InputValue()
    SimulateInput()
    TextContent()
}
```

## grit/example.js

```js
// @team WebApp Architecture

// eslint-disable-next-line no-restricted-imports
import { mount } from 'enzyme';
import '@gusto/legacy-test-shims/enzyme';
import Employee from '../../../models/employee';
import DatePickerFormField from './date_picker_form_field';
import fixture from 'spec/jest/fixture';

describe('Components Controls Inputs DatePickerFormField', () => {
  let component;
  const employeeData = fixture.load('basic_employee.json');
  const props = {
    label: 'Date',
  };
  let value = null;
  const attribute = null;
  let modelDate = null;

  beforeEach(() => {
    props.value = value;
    const employee = new Employee(employeeData);
    employee.get = jest.fn().mockReturnValue(modelDate);
    employee.set = jest.fn();
    props.onChange = jest.fn();
    props.model = employee;
    props.attribute = attribute;
    component = mount(<DatePickerFormField {...props} />);
  });

  describe('rendering', () => {
    it('renders a DatePickerFormField', () => {
      expect(component.find(DatePickerFormField)).toHaveLength(1);
    });
  });

  describe('default value', () => {
    describe('when value is passed to the component', () => {
      beforeAll(() => {
        value = '2001-01-1';
      });

      it('renders', () => {
        expect(component.find('input.form-control.has-help').prop('value')).toBe('2001/01/01');
      });
    });

    describe('when value is null and model attribute exists', () => {
      beforeAll(() => {
        value = null;
        modelDate = '2002-02-02';
      });

      it('renders', () => {
        expect(component.find('input.form-control.has-help').prop('value')).toBe('2002/02/02');
        expect(component.find('input.form-control.has-help').prop('value')).toBe('2002/02/02');
      });
    });
  });

  describe('on change', () => {
    it('calls model set', () => {
      component.find('input').simulate('change', '2003-03-03');
      expect(props.model.set).toHaveBeenCalled();
      expect(props.onChange).toHaveBeenCalled();
    });
  });
});

```
```js
// @team WebApp Architecture

// eslint-disable-next-line no-restricted-imports
import { mount } from 'enzyme';
import '@gusto/legacy-test-shims/enzyme';
import Employee from '../../../models/employee';
import DatePickerFormField from './date_picker_form_field';
import fixture from 'spec/jest/fixture';

import { render, fireEvent } from '@testing-library/react';

describe('Components Controls Inputs DatePickerFormField', () => {
  let component;
  const employeeData = fixture.load('basic_employee.json');
  const props = {
    label: 'Date',
  };
  let value = null;
  const attribute = null;
  let modelDate = null;

  beforeEach(() => {
    props.value = value;
    const employee = new Employee(employeeData);
    employee.get = jest.fn().mockReturnValue(modelDate);
    employee.set = jest.fn();
    props.onChange = jest.fn();
    props.model = employee;
    props.attribute = attribute;
    component = render(<DatePickerFormField {...props} />);
  });

  describe('rendering', () => {
    it('renders a DatePickerFormField', () => {
      expect(component.find(DatePickerFormField)).toHaveLength(1);
    });
  });

  describe('default value', () => {
    describe('when value is passed to the component', () => {
      beforeAll(() => {
        value = '2001-01-1';
      });

      it('renders', () => {
        expect(component.find('input.form-control.has-help').value).toBe('2001/01/01');
      });
    });

    describe('when value is null and model attribute exists', () => {
      beforeAll(() => {
        value = null;
        modelDate = '2002-02-02';
      });

      it('renders', () => {
        expect(component.find('input.form-control.has-help').value).toBe('2002/02/02');
        expect(component.find('input.form-control.has-help').value).toBe('2002/02/02');
      });
    });
  });

  describe('on change', () => {
    it('calls model set', () => {
      const selector = component.find('input');

      fireEvent.change(selector, {
        target: {
          value: '2003-03-03'
        }
      });

      expect(props.model.set).toHaveBeenCalled();
      expect(props.onChange).toHaveBeenCalled();
    });
  });
});

```

## grit/test-1.js

```js
// @team WebApp Architecture
// MIGRATE THIS

// eslint-disable-next-line no-restricted-imports
import { mount } from 'enzyme';
import '@gusto/legacy-test-shims/enzyme';

import Company from '../../../models/company';
import FormField from './form_field';
import fixture from 'spec/jest/fixture';

describe('Components Controls Inputs FormField', () => {
  const companyData = fixture.load('basic_company.json');
  const testObject = {};

  const renderFormField = () => {
    const element = (
      <FormField label="Fake Label" model={testObject.company} attribute="name" name="name">
        <span>Some child</span>
      </FormField>
    );
    return mount(element);
  };

  beforeEach(() => {
    testObject.company = new Company(companyData);
    testObject.component = renderFormField();
  });

  describe('render', () => {
    it('renders the form field correctly with children', () => {
      expect(testObject.component.find('div.form-group')).to.be.present();

      const label = testObject.component.find('label.control-label');
      expect(label).to.be.present();
      expect(label.text()).toEqual('Fake Label');

      expect(testObject.component.find('span').text()).toEqual('Some child');
    });

    it('hides the label if no label is specified', () => {
      const element = (
        <FormField model={testObject.company} attribute="name" name="name">
          <span>Some child</span>
        </FormField>
      );
      const component = mount(element);

      expect(component.find('.control-label')).not.to.be.present();
    });

    describe('tooltips', () => {
      it('renders a tooltip', () => {
        expect(testObject.component.find('.help-float').find('p')).toHaveLength(1);
      });
    });

    describe('error', () => {
      beforeEach(() => testObject.company.set('errors', { name: 'ERROR TEXT' }));

      afterEach(() => testObject.company.unset('errors'));

      it('renders properly', () => {
        const component = renderFormField();

        expect(component.find('.help-block').text()).toBe('ERROR TEXT');
      });
    });
  });
});

```
```js
// @team WebApp Architecture
// MIGRATE THIS

// eslint-disable-next-line no-restricted-imports
import { mount } from 'enzyme';
import '@gusto/legacy-test-shims/enzyme';

import Company from '../../../models/company';
import FormField from './form_field';
import fixture from 'spec/jest/fixture';

import { render } from '@testing-library/react';

describe('Components Controls Inputs FormField', () => {
  const companyData = fixture.load('basic_company.json');
  const testObject = {};

  const renderFormField = () => {
    const element = (
      <FormField label="Fake Label" model={testObject.company} attribute="name" name="name">
        <span>Some child</span>
      </FormField>
    );
    return render(element);
  };

  beforeEach(() => {
    testObject.company = new Company(companyData);
    testObject.component = renderFormField();
  });

  describe('render', () => {
    it('renders the form field correctly with children', () => {
      expect(testObject.component.find('div.form-group')).to.be.present();

      const label = testObject.component.find('label.control-label');
      expect(label).to.be.present();
      expect(label.textContent).toEqual('Fake Label');

      expect(testObject.component.find('span').textContent).toEqual('Some child');
    });

    it('hides the label if no label is specified', () => {
      const element = (
        <FormField model={testObject.company} attribute="name" name="name">
          <span>Some child</span>
        </FormField>
      );
      const component = render(element);

      expect(component.find('.control-label')).not.to.be.present();
    });

    describe('tooltips', () => {
      it('renders a tooltip', () => {
        expect(testObject.component.find('.help-float').find('p')).toHaveLength(1);
      });
    });

    describe('error', () => {
      beforeEach(() => testObject.company.set('errors', { name: 'ERROR TEXT' }));

      afterEach(() => testObject.company.unset('errors'));

      it('renders properly', () => {
        const component = renderFormField();

        expect(component.find('.help-block').textContent).toBe('ERROR TEXT');
      });
    });
  });
});

```

## grit/test-2.js

```js
// @team WebApp Architecture
// MIGRATE THIS

// eslint-disable-next-line no-restricted-imports
import { mount } from 'enzyme';
import '@gusto/legacy-test-shims/enzyme';

import Company from '../../../models/company';
import Radio from './radio';
import Tooltip from '../tooltip';
import fixture from 'spec/jest/fixture';

describe('Components Controls Inputs Radio', () => {
  const companyData = fixture.load('basic_company.json');
  const DOMElements = {};
  const testObject = {};

  beforeEach(() => {
    testObject.company = new Company(companyData);
    testObject.company.set('radio_test', 'woohoo!');
    const element = (
      <Radio
        model={testObject.company}
        attribute="radio_test"
        options={[
          { text: 'Woo', value: 'woohoo!' },
          { text: 'Boo', value: 'boohoo!' },
        ]}
      />
    );
    testObject.component = mount(element);

    DOMElements.inputs = testObject.component.find('input');
    DOMElements.parentDiv = testObject.component.find('.form-group.tooltip-group');
  });

  describe('input value', () => {
    it('should have the models value', () => {
      expect(testObject.component.instance().state.value).toBe('woohoo!');
    });

    it('should select the correct input by default', () => {
      const checked = DOMElements.inputs.filterWhere(input => input.prop('value') === 'woohoo!');
      expect(checked.prop('checked')).toEqual(true);
    });

    it('should update the state and model when the input is updated', () => {
      DOMElements.inputs.last().simulate('change');
      expect(testObject.component.instance().state.value).toBe('boohoo!');
      expect(testObject.company.get('radio_test')).toBe(false);
    });

    describe('with value provided', () => {
      beforeEach(() => {
        const element = (
          <Radio
            model={testObject.company}
            attribute="radio_test"
            options={[
              { text: 'Woo', value: 'woohoo!' },
              { text: 'Boo', value: 'boohoo!' },
            ]}
            value="boohoo!"
          />
        );
        testObject.component = mount(element);
      });

      it('should use the passed in value', () => {
        expect(testObject.component.instance().state.value).toBe('boohoo!');
      });
    });

    describe('with onChange provided', () => {
      beforeEach(() => {
        testObject.changed = false;
        const onChange = () => {
          testObject.changed = true;
        };
        const element = (
          <Radio
            model={testObject.company}
            attribute="radio_test"
            options={[
              { text: 'Woo', value: 'woohoo!' },
              { text: 'Boo', value: 'boohoo!' },
            ]}
            onChange={onChange}
          />
        );
        testObject.component = mount(element);

        DOMElements.inputs = testObject.component.find('input');
      });

      it('should execute an onChange event', () => {
        expect(testObject.changed).toBe(false);
        DOMElements.inputs.last().simulate('change');
        expect(testObject.changed).toBe(true);
      });
    });
  });

  describe('on error', () => {
    beforeEach(() => {
      testObject.errorMessage = 'Must be greater than 0.';
      testObject.company.set('errors', { radio_test: testObject.errorMessage });
      testObject.component.update();
    });

    it('should add an error', () => {
      expect(testObject.component.instance().hasError()).toBe(true);
      expect(DOMElements.parentDiv).to.have.className('error');
      const element = testObject.component.find('.help-block.error');
      expect(element.text()).toEqual(testObject.errorMessage);
    });
  });

  describe('tooltips', () => {
    it('should not render a tooltip', () => {
      expect(testObject.component.find(Tooltip).find('p')).toHaveLength(0);
    });
  });
});

```
```js
// @team WebApp Architecture
// MIGRATE THIS

// eslint-disable-next-line no-restricted-imports
import { mount } from 'enzyme';
import '@gusto/legacy-test-shims/enzyme';

import Company from '../../../models/company';
import Radio from './radio';
import Tooltip from '../tooltip';
import fixture from 'spec/jest/fixture';

import { render } from '@testing-library/react';

describe('Components Controls Inputs Radio', () => {
  const companyData = fixture.load('basic_company.json');
  const DOMElements = {};
  const testObject = {};

  beforeEach(() => {
    testObject.company = new Company(companyData);
    testObject.company.set('radio_test', 'woohoo!');
    const element = (
      <Radio
        model={testObject.company}
        attribute="radio_test"
        options={[
          { text: 'Woo', value: 'woohoo!' },
          { text: 'Boo', value: 'boohoo!' },
        ]}
      />
    );
    testObject.component = render(element);

    DOMElements.inputs = testObject.component.find('input');
    DOMElements.parentDiv = testObject.component.find('.form-group.tooltip-group');
  });

  describe('input value', () => {
    it('should have the models value', () => {
      expect(testObject.component.instance().state.value).toBe('woohoo!');
    });

    it('should select the correct input by default', () => {
      const checked = DOMElements.inputs.filterWhere(input => input.value === 'woohoo!');
      expect(checked.prop('checked')).toEqual(true);
    });

    it('should update the state and model when the input is updated', () => {
      DOMElements.inputs.last().simulate('change');
      expect(testObject.component.instance().state.value).toBe('boohoo!');
      expect(testObject.company.get('radio_test')).toBe(false);
    });

    describe('with value provided', () => {
      beforeEach(() => {
        const element = (
          <Radio
            model={testObject.company}
            attribute="radio_test"
            options={[
              { text: 'Woo', value: 'woohoo!' },
              { text: 'Boo', value: 'boohoo!' },
            ]}
            value="boohoo!"
          />
        );
        testObject.component = render(element);
      });

      it('should use the passed in value', () => {
        expect(testObject.component.instance().state.value).toBe('boohoo!');
      });
    });

    describe('with onChange provided', () => {
      beforeEach(() => {
        testObject.changed = false;
        const onChange = () => {
          testObject.changed = true;
        };
        const element = (
          <Radio
            model={testObject.company}
            attribute="radio_test"
            options={[
              { text: 'Woo', value: 'woohoo!' },
              { text: 'Boo', value: 'boohoo!' },
            ]}
            onChange={onChange}
          />
        );
        testObject.component = render(element);

        DOMElements.inputs = testObject.component.find('input');
      });

      it('should execute an onChange event', () => {
        expect(testObject.changed).toBe(false);
        DOMElements.inputs.last().simulate('change');
        expect(testObject.changed).toBe(true);
      });
    });
  });

  describe('on error', () => {
    beforeEach(() => {
      testObject.errorMessage = 'Must be greater than 0.';
      testObject.company.set('errors', { radio_test: testObject.errorMessage });
      testObject.component.update();
    });

    it('should add an error', () => {
      expect(testObject.component.instance().hasError()).toBe(true);
      expect(DOMElements.parentDiv).to.have.className('error');
      const element = testObject.component.find('.help-block.error');
      expect(element.textContent).toEqual(testObject.errorMessage);
    });
  });

  describe('tooltips', () => {
    it('should not render a tooltip', () => {
      expect(testObject.component.find(Tooltip).find('p')).toHaveLength(0);
    });
  });
});

```

## grit/test-3.js

```js
// @team WebApp Architecture

import _ from 'underscore';
// eslint-disable-next-line no-restricted-imports
import { mount } from 'enzyme';
import '@gusto/legacy-test-shims/enzyme';
import $ from 'jquery';
import Employee from '../../../models/employee';
import Select from './select';
import fixture from 'spec/jest/fixture';
import { state_info as StateInfo } from 'state_info_constants';

describe('Components Controls Inputs Select', () => {
  const employeeData = fixture.load('basic_employee.json');
  const DOMElements = {};
  const testObject = {};

  describe('for an EmployeeStatefield', () => {
    beforeEach(() => {
      testObject.employee = new Employee(employeeData);
      testObject.employeeStateField = testObject.employee.workStateField();
      testObject.compOpts = {
        attribute: 'filing_status',
        options: [
          { text: 'Single', value: 'S' },
          { text: 'Married', value: 'M' },
          { text: 'Exempt', value: 'E' },
        ],
      };
      const element = (
        <Select
          {..._.extend(testObject.compOpts, {
            model: testObject.employeeStateField,
          })}
        />
      );
      testObject.component = mount(element);

      DOMElements.select = testObject.component.find('select');
      DOMElements.options = testObject.component.find('option');
      DOMElements.parentDiv = testObject.component.find('.form-group.tooltip-group');
    });

    describe('input value', () => {
      it('should have the models value', () => {
        expect(testObject.component.instance().state.value).toBe('S');
      });

      it('should update the state and model when the input is updated', () => {
        DOMElements.options.at(2).simulate('change');
        expect(testObject.component.instance().state.value).toBe('M');
        expect(testObject.employeeStateField.get('filing_status')).toBe('M');
      });

      describe('with value provided', () => {
        beforeEach(() => {
          const element = (
            <Select
              {..._.extend(testObject.compOpts, {
                model: testObject.employeeStateField,
                value: 'M',
              })}
            />
          );
          testObject.component = mount(element);
        });

        it('should use the passed in value if provided', () => {
          expect(testObject.component.instance().state.value).toBe('M');
        });
      });

      describe('with onChange provided', () => {
        beforeEach(() => {
          testObject.changed = false;
          const element = (
            <Select
              {..._.extend(testObject.compOpts, {
                model: testObject.employeeStateField,
                onChange() {
                  testObject.changed = true;
                },
              })}
            />
          );
          testObject.component = mount(element);

          DOMElements.options = testObject.component.find('option');
        });

        it('should execute an onChange event', () => {
          expect(testObject.changed).toBe(false);
          DOMElements.options.at(2).simulate('change');
          expect(testObject.changed).toBe(true);
        });
      });
    });

    describe('on error', () => {
      beforeEach(() => {
        testObject.errorMessage = 'Must be greater in the list.';
        testObject.employeeStateField.set('errors', {
          filing_status: testObject.errorMessage,
        });
        testObject.component.update();
      });

      it('should add an error', () => {
        expect(testObject.component.instance().hasError()).toBe(true);
        expect(DOMElements.parentDiv).to.have.className('error');
        const element = testObject.component.find('.help-block.error');
        expect(element.text()).toEqual(testObject.errorMessage);
      });
    });

    describe('tooltips', () => {
      it('should render a tooltip if it has one', () => {
        const tooltip =
          StateInfo[testObject.employeeStateField.state()].toolTips.employee_state_field
            .filing_status;
        const tooltipDiv = testObject.component.find('.help-float');
        expect(tooltipDiv.find('p').text()).toBe($('<p />').html(tooltip).text());
      });
    });
  });
});

```
```js
// @team WebApp Architecture

import _ from 'underscore';
// eslint-disable-next-line no-restricted-imports
import { mount } from 'enzyme';
import '@gusto/legacy-test-shims/enzyme';
import $ from 'jquery';
import Employee from '../../../models/employee';
import Select from './select';
import fixture from 'spec/jest/fixture';
import { state_info as StateInfo } from 'state_info_constants';

import { render } from '@testing-library/react';

describe('Components Controls Inputs Select', () => {
  const employeeData = fixture.load('basic_employee.json');
  const DOMElements = {};
  const testObject = {};

  describe('for an EmployeeStatefield', () => {
    beforeEach(() => {
      testObject.employee = new Employee(employeeData);
      testObject.employeeStateField = testObject.employee.workStateField();
      testObject.compOpts = {
        attribute: 'filing_status',
        options: [
          { text: 'Single', value: 'S' },
          { text: 'Married', value: 'M' },
          { text: 'Exempt', value: 'E' },
        ],
      };
      const element = (
        <Select
          {..._.extend(testObject.compOpts, {
            model: testObject.employeeStateField,
          })}
        />
      );
      testObject.component = render(element);

      DOMElements.select = testObject.component.find('select');
      DOMElements.options = testObject.component.find('option');
      DOMElements.parentDiv = testObject.component.find('.form-group.tooltip-group');
    });

    describe('input value', () => {
      it('should have the models value', () => {
        expect(testObject.component.instance().state.value).toBe('S');
      });

      it('should update the state and model when the input is updated', () => {
        DOMElements.options.at(2).simulate('change');
        expect(testObject.component.instance().state.value).toBe('M');
        expect(testObject.employeeStateField.get('filing_status')).toBe('M');
      });

      describe('with value provided', () => {
        beforeEach(() => {
          const element = (
            <Select
              {..._.extend(testObject.compOpts, {
                model: testObject.employeeStateField,
                value: 'M',
              })}
            />
          );
          testObject.component = render(element);
        });

        it('should use the passed in value if provided', () => {
          expect(testObject.component.instance().state.value).toBe('M');
        });
      });

      describe('with onChange provided', () => {
        beforeEach(() => {
          testObject.changed = false;
          const element = (
            <Select
              {..._.extend(testObject.compOpts, {
                model: testObject.employeeStateField,
                onChange() {
                  testObject.changed = true;
                },
              })}
            />
          );
          testObject.component = render(element);

          DOMElements.options = testObject.component.find('option');
        });

        it('should execute an onChange event', () => {
          expect(testObject.changed).toBe(false);
          DOMElements.options.at(2).simulate('change');
          expect(testObject.changed).toBe(true);
        });
      });
    });

    describe('on error', () => {
      beforeEach(() => {
        testObject.errorMessage = 'Must be greater in the list.';
        testObject.employeeStateField.set('errors', {
          filing_status: testObject.errorMessage,
        });
        testObject.component.update();
      });

      it('should add an error', () => {
        expect(testObject.component.instance().hasError()).toBe(true);
        expect(DOMElements.parentDiv).to.have.className('error');
        const element = testObject.component.find('.help-block.error');
        expect(element.textContent).toEqual(testObject.errorMessage);
      });
    });

    describe('tooltips', () => {
      it('should render a tooltip if it has one', () => {
        const tooltip =
          StateInfo[testObject.employeeStateField.state()].toolTips.employee_state_field
            .filing_status;
        const tooltipDiv = testObject.component.find('.help-float');
        expect(tooltipDiv.find('p').textContent).toBe($('<p />').html(tooltip).textContent);
      });
    });
  });
});

```

## grit/test-4.js

```js
// Write a custom test here
test('has correct welcome text', () => {
  const wrapper = shallow(<Welcome firstName="John" lastName="Doe" />)
  expect(wrapper.find('h1').text()).toEqual('Welcome, John Doe')
})
```
```js
import { render } from '@testing-library/react';
// Write a custom test here
test('has correct welcome text', () => {
  const wrapper = render(<Welcome firstName="John" lastName="Doe" />)
  expect(wrapper.find('h1').textContent).toEqual('Welcome, John Doe')
})

```

## grit/test-5.js

```js
// Write a custom test here
test('has correct input value', () => {
  const wrapper = shallow(<Welcome firstName="John" lastName="Doe" />)
  expect(wrapper.find('input[name="firstName"]').value).toEqual('John')
  expect(wrapper.find('input[name="lastName"]').value).toEqual('Doe')
})
```
```js
import { render, screen } from '@testing-library/react';
// Write a custom test here
test('has correct input value', () => {
  const wrapper = render(<Welcome firstName="John" lastName="Doe" />)
  expect(screen.getByRole('textbox', {
    name: "firstName"
  }).value).toEqual('John')
  expect(screen.getByRole('textbox', {
    name: "lastName"
  }).value).toEqual('Doe')
})

```


