# autopilot-styles
A central domain for shared styles and tooling

## What is the intent of this project?
- define a modular SCSS structure
- set up common starting place capable of supporting any design
- set up good styling defaults

## Get Started
- `npm install`
- `npm run dev`

## SCSS Structure

SCSS is organized into two main folders, with subfolders for different SCSS Components.

```
$ tree -d -L 3 scss/
scss/
├── _config: for setup and configuration. These files should output no CSS by themselves
│   ├── foundation: set up variables, maps, functions, and mixins for design language
│   │   ├── breakpoints
│   │   ├── colors
│   │   ├── sizes
│   │   ├── typography
│   │   └── z-index
│   ├── layouts
│   ├── utilities: general math and styles calculations
│   │   ├── functions
│   │   └── mixins
│   └── vendor: Place `*.scss` files in here that need to get imported early as vendor styles before others
└── base: App styles. These files output css, using the setup from CONFIG
```

## SCSS Components

SCSS Component are in individual subfolders. Not every SCSS Component has or needs every partial file. Some will have more, based on complexity.

```
scss-component folder
├── _functions.scss: for calculations
├── _map.scss: for structured variables
├── _mixins.scss: SCSS mixins
└── _variables.scss: general SCSS variables.
```

## Grids and Layout

Autopilot-styles includes a new layout system based on the new [CSS Grid](https://developer.mozilla.org/en-US/d…) standard, with an optional Flexbox fallback. CSS Grid allows us to create precise layouts with much less code than previous techniques, and many layouts that were impossible, difficult, or brittle previously. There are a few ways to use this system. 

### Directly with Mixins

This method generates the least amount of compiled CSS and offers the most control over the design. The following code will create a simple 3 column grid. 

```scss
.some-selector {
  @include grid-container();
  @include grid-calc-columns(3);
}
```

With [Breakpoint](https://github.com/at-import/breakpoint) you can add to this to create complex layouts. The following will:
 - create a two colum grid with a 1em gutter at narrow widths
 - then a three column grid with a 2em gutter (by default) at medium widths
 - finally a very customized four column grid at large widths

 There are also mixins applied to grid items to precisely control where they are placed and how many columns and rows they span at the large width.

```scss
.some-selector {
  @include grid-container();
  @include grid-calc-columns(2, 1em); // arguments: number of columns, gutter width

  @include breakpoint(get-breakpoint(md)) {
    @include grid-calc-columns(3);
  }

  @include breakpoint(get-breakpoint(lg)) {
    @include grid-calc-columns(20% 1fr 2fr 33%); // arguments: instead of the number of even columns, you can optionally pass in any valid css grid column definition
  }

  .some-direct-child-selector {
    @include breakpoint(get-breakpoint(lg)) {
      &:nth-child(1) {
        @include grid-item-row-span(3); // The first item will span three rows
      }

      &:nth-child(2) {
        @include grid-item-column-span(2); // This item will span 2 columns  
      }

      &:nth-child(3) {
        @include grid-item-row-span(2); // This item will span 2 rows
      }

      &:nth-child(4) {
        @include grid-item-row-span(2); // This item will span 2 rows
      }

      &:nth-child(5) {
        @include grid-item-column-placement(2, 3); // This item will span 2 columns, and is explicitly placed in the 3rd column
        @include grid-item-order(6); // This item is moved out of the natural sort order
      }

      &:nth-child(6) {
        @include grid-item-order(5); // This item is moved out of the natural sort order
      }
    }
  }
}
```
![Screenshot of a complex grid](/docs/assets/grid-complex.png?raw=true "Complex grid example")

### Generated Grid Framework with classes

Alternately you can generate a class-based grid framework, with or without the flexbox fallback styles. This will let you create equal-width columns, and control the grid columns, items, and responsive characteristics with css classes. Be mindful that generating a grid framework will create more css than necessary for any use case, because it has to cover all potential layout use cases. 

Classes for grid containers: 
- `.grid-container` - establishes a grid container
- `.cols-1`, `.cols-2`, `.cols-3`, etc - sets how many columns in a grid
- `.sm-cols-2`, `.sm-cols-3`, `.md-cols-3`, `.md-cols-4`, `.lg-cols-4`, `.xl-cols-6`, etc - sets how many columns at different responsive breakpoints

Classes for grid items:
- `.grid-item` - _only needed when using flex fallback_
- `.span-2`, `.span-3`, etc - sets how many columns to span
- `.md-span-2`, `.lg-span-3`, etc - sets how many columns to span at different responsive breakpoints
- `.row-span-2`, `.row-span-3`, etc - sets how many rows to span - __not available in flexbox__
- `.md-row-span-2`, `.lg-row-span-3`, etc - sets how many rows to span at different responsive breakpoints - __not available in flexbox__
- `.col-2of4at2` - precisely sets the span and position of an element, in this case the item will span two columns at the second column in a four column grid - __available in flexbox, but not in multi-row grids__
- `.lg-col-3of6at3` - appending a responsive prefix to the above class will apply precise positioning at different breakpoints - __available in flexbox, but not in multi-row grids__
- `.order-3`, `.md-order-3` - order classes and order classes with responsive prefixes let you control the order of grid items

![Framework grid controlled by classes](/docs/assets/grid-classes.png?raw=true "Framework grid controlled by classes")

#### Notes on generating grid frameworks

As noted above generating a class-based grid framework comes with certain trade-offs. You gain the ability to layout pages and components using only classes, and do not need to write custom styles or use the provided mixins individually, but you will generate more CSS than you will likely need.

The following settings variables are provided to help limit the generated CSS to the needs of your project.

- `$grid-gap: 2em;` - the default gutter between grid items
- `$use-flex-fallback: false;` - set to true if you require flexbox support (for older IE primarily)
- `$generate-grid-framework: false;` - set to true if you want to generate a class based grid system
- `$generate-advanced-flex-layouts: false;` - *experimental* set to true if you are using the flex fallback AND you want it to attempt to replicate some of the precise positioning features of css grid
- `$generated-items-max-flexbox: 10;` - the number of grid items classes for the flexbox fallback. Only needed when using advanced flex layouts
- `$generated-cols-max: 12;` - the number of columns generated. Set this to the smallest number you need.


## SCSS Extends

__tldr; SCSS extends are not included, and are discouraged in practice.__

The use of SCSS @extends is a slightly contentious debate in Sass. I've come down on the “use extends as little as necessary” camp because anything an extend can do, a mixin can also do, with roughly the same amount of generated css. And because extends break when used in media queries, and balloon the css when applied to base elements I discourage them.

[Hugo Giraudel on Sass @extends](https://www.sitepoint.com/avoid-sass-extend/)


## CSS Property Sort Order

The CSS properties are sorted using the “Concentric” property sort order, which may be the sort order that best follows the box model. The properties start from the outside of the box and work their way in, as outlined in [Brandon Rhodes' Post](http://rhodesmill.org/brandon/2011/concentric-css/).

![CSS box model](http://www.w3.org/TR/CSS2/images/boxdim.png)

Simplified concentric template
```
{
    display: ;    /* Where and how the box is placed */
    position: ;
    float: ;
    clear: ;

    visibility: ; /* Can the box be seen? */
    opacity: ;
    z-index: ;

    margin: ;     /* Layers of the box model */
    outline: ;
    border: ;
    background: ;
    padding: ;

    width: ;      /* Content dimensions and scrollbars */
    height: ;
    overflow: ;

    color: ;      /* Text */
    text: ;
    font: ;
}
```

- [sass-lint](https://github.com/sasstools/sass-lint)
- [sass-lint property sort docs](https://github.com/sasstools/sass-lint/blob/develop/lib/config/property-sort-orders/concentric.yml)


## SassDoc

Each SCSS partial is commented using the syntax to generate documentation in SassDoc. Running `npm run validate:sass` or `npm run watch:sass` will generate the docs. Running `npm run browserSync` will start a server to display the docs.

- [SassDoc](http://sassdoc.com/)
