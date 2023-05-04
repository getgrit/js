---
title: Convert Styled JSX to CSS Modules
---

# {{ page.title }}

Extract all Styled JSX from a particular file and move it to CSS Module files.
- If there are multiple components in a given file, we create separate CSS Module file for each one.
- Styles defined as global are currently moved to the same CSS Module file with scope set to global.
- We use variable/component names for exporeted styles to create CSS Module files, and current filename for default exports.
- Currently given the limitation of processing the CSS code snippet, we don't touch styles that have conditions in them and that are evaluated on runtime. eg. `background-color: prop.active ? '#e7e7e7' : '#fff'`

tags: #good

```grit
language js

pattern UpdateClassName() {
  JSXElement(children=$children, openingElement=JSXOpeningElement(attributes=[..., `className="$classesRaw"`, ...])) where {
    ensureImportFrom(`cn`, `'classnames'`)
    $children <: contains bubble($classesRaw) `<style $_>{$styles}</style>` where {
      $styles <: contains bubble($classesRaw) TemplateElement(value=RawCooked(raw=$css)) where {
        
        // NOTE: This is a hack for now we need to find a better way to do this.
        // Idea is to select all classnames from the style.
        // Currently regular expression to r"***"($classNames) doesn't work.

        // Replace everything but the classnames.
        $classNames = replaceAll($css, r"(?:\\s*\\{[\\s\\S]*?\\})|(?:\\b(?!\\.)\\w+\\b(?!\\s*\\{))", "")
        // Remove extra spaces and new lines.
        $classNames = replaceAll($classNames, r"[\\s\\n]+", "")
        // Trim and split classnames
        $classNames = trim(replaceAll($classNames, ".", " "))
        $classNames = split(" ", $classNames)
        
        $classList = []
        $classNames <: some bubble($classList) $class where {
            $classList = [... $classList, raw("styles."+$class) ]
        }

        $classesRaw => `cn($classList)`
      }
    }
  }
}

predicate IsGlobalStyle($scope) {
  $scope <: contains `global`
}

predicate CreateCSSModule($styles, $cssFileName, $scope) {
  // Currently this only selects css with no expressions that needs to be evaluated on runtime.
  $styles <: or {
    bubble($scope, $cssFileName) TemplateLiteral(quasis=[$css]) where {
      if (IsGlobalStyle($scope)) {
        // Instead of bundling all globals in a file we scope them as global.
        $scopedCSS = raw(":global{\n" + unparse($css) + "\n}")
      } else {
        $scopedCSS = raw(unparse($css))
      }
      $newFiles = [File(name = $cssFileName, program = Program([$scopedCSS]))]
    }
    bubble($scope, $cssFileName) RawCooked(raw=$css) where {
      if (IsGlobalStyle($scope)) {
        $scopedCSS = raw(":global{\n" + $css + "\n}")
      } else {
        $scopedCSS = raw($css)
      }
      $newFiles = [File(name = $cssFileName, program = Program([$scopedCSS]))]
    }
  }
} 

pattern ExportStyles($cssFile) {
  bubble($cssFile) `<style $scope>{$styles}</style>` as $jsxMatch where {
    $jsxMatch => .
    CreateCSSModule($styles, $cssFile, $scope)
    ensureImportFrom(`styles`, `$cssFile`)
  }
}

pattern RewriteNamedComponents() {
  bubble `const $compName = ($_) => $body` where {
    $file = join(".", [$compName, "module.css"])
    $body <: contains bubble($file) ExportStyles($file)
    $body <: maybe contains bubble UpdateClassName()
  }
}

pattern RewriteDefaultComponents() {
  bubble `export default () => $body` where {
    $file = replaceAll($filename, "tsx", "module.css")
    $body <: contains bubble($file) ExportStyles($file)
  }
}

pattern RewriteNamedStyleExports() {
    `const $styleName = $body` where {
        $body <: bubble($body, $styleName) TaggedTemplateExpression(tag=$tag, quasi=$styles) where {
            $cssFileName = join(".", [$styleName, "module.css"])
            ensureImportFrom(Identifier(name=s"${styleName}Styles"), `$cssFileName`)
            CreateCSSModule($styles, $cssFileName, $tag)
            $body => raw(s"${styleName}Styles")
        }
    }
}

pattern RewriteDefaultStyleExports() {
    `export default $body` where {
        $body <: bubble($body) TaggedTemplateExpression(tag=$tag, quasi=$styles) where {
            $cssFileName = replaceAll($filename, "tsx", "module.css")
            ensureImportFrom(`defaultStyles`, `$cssFileName`)
            CreateCSSModule($styles, $cssFileName, $tag)
            $body => `defaultStyles`
        }
    }
}

or {
  RewriteNamedComponents()
  RewriteDefaultComponents()
  RewriteNamedStyleExports()
  RewriteDefaultStyleExports()
}
```

