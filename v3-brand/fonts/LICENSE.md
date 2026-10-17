# Fonts in this folder

Both fonts are licensed under the SIL Open Font License 1.1. The full licence texts with their copyright lines sit next to the fonts:

- `OFL-Oswald.txt` for `display-700.woff2`
- `OFL-Exo2.txt` for `exo2-var.woff2`

- `display-700.woff2`: subset (Latin + Cyrillic incl. Ukrainian) of **Oswald Bold 3.0**, Copyright (c) 2010-13 by Vernon Adams, with Reserved Font Name "Oswald". A subset is a Modified Version, so it is renamed `V3Display` (name table IDs 1, 3, 4, 6; the word "Oswald" occurs in no table of the file). Source file: the Oswald Bold TTF installed on the owner's Mac (~/Library/Fonts).
- `exo2-var.woff2`: subset (Latin + Cyrillic incl. Ukrainian) of **Exo 2** variable (wght 100-900), Copyright 2013 The Exo 2 Project Authors (https://github.com/googlefonts/Exo-2.0). No Reserved Font Name.

Licence text source (accessed 2026-10-17): https://raw.githubusercontent.com/google/fonts/main/ofl/oswald/OFL.txt and https://raw.githubusercontent.com/google/fonts/main/ofl/exo2/OFL.txt. For Oswald, the upstream header line ("Copyright 2016 The Oswald Project Authors") was replaced by the copyright line of the shipped font file, because the shipped font is the older 3.0 release by Vernon Adams.

Subset made with fontTools `pyftsubset` on 2026-10-17. Not included: U+20B4 (hryvnia sign) and arrows; the page writes "грн" and draws arrows as inline SVG.
