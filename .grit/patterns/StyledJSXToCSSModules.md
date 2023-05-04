---
title: Convert Styled JSX to CSS Modules
---

# {{ page.title }}

Extract all Styled JSX from a particular file and move it to CSS Module files, if there are multiple components in a given file, we create separate CSS Module file for each one. Styles defined as global are currently moved to the same CSS Module file with scope set to global.

tags: #good

```grit
language js

pattern UpdateClassName() {
  JSXElement(children=$children, openingElement=JSXOpeningElement(attributes=[..., `className="$classesRaw"`, ...])) where {
    ensureImportFrom(`cn`, `'classnames'`)
    $children <: contains bubble($classesRaw) `<style $_>{$styles}</style>` where {
      $styles <: contains bubble($classesRaw) TemplateElement(value=RawCooked(raw=$css)) where {
        // $css <: r"\\.[a-zA-Z_\\-][a-zA-Z0-9_\\-]*"($styleClassNamesList)
        $classSplit = split(" ", $classesRaw)
        $classesRaw => `cn($classSplit)`
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

pattern RewriteStyleExports() {
  TaggedTemplateExpression(tag=$tag, quasi=$styles) as $taggedStyles where {
    if (IsGlobalStyle($tag)) {
      $cssFileName = replaceAll($filename, "tsx", "global.module.css")
    } else {
      $cssFileName = replaceAll($filename, "tsx", "module.css")
    }
    $taggedStyles => .
    CreateCSSModule($styles, $cssFileName, $tag)
  }
}

or {
  RewriteNamedComponents()
  RewriteDefaultComponents()
  RewriteStyleExports()
}
```

