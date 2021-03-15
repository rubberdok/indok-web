import Template from "@components/pages/about/Template";
import { Typography } from "@material-ui/core";
import { NextPage } from "next";
import React from "react";

const BoardPage: NextPage = () => {
  return (
    <Template
      img="img/hero.jpg"
      title="Om foreningen vår"
      page=""
      description="Foreningen for Studentene ved Industriell Økonomi og Teknologiledelse er den øverste instansen
      (moderorganisasjonen) for all studentfrivillighet på masterstudiet Indøk ved NTNU."
    >
      <ul>
        <li>2008-2009: Ole Heliesen og Georg Øiesvold</li>
        <li>2009-2010: Magnus Valmot og Ole-Christen Enger</li>
        <li>2010-2011: Thomas Eide og Ole-Daniel Nitter</li>
        <li>2011-2012: Michael Wiik og Iver Roen Velo</li>
        <li>2012-2013: Anja Graff Nesse og Steinar H. Fretheim</li>
        <li>2013-2014: Ove Mørch og Christian Fredrik Scheel</li>
        <li>2014-2015: Lars Arild Wold og Marianne Engseth</li>
        <li>2015-2016: Marius Lie Morken og Hanne Sandven</li>
        <li>2016-2017: Simen Nygaard Hansen og Kristoffer Birkeland</li>
        <li>2017-2018: Gard Rystad og Vemund Wøien</li>
        <li>2018-2019: Daniel Kittilsen Henriksen og Amanda Borge Byrkjeland</li>
        <li>2019-2020: Peder Gjerstad og Mette Liset</li>
        <li>2020-2021: Andreas Johannesen og Lars Lien Ankile</li>
      </ul>
    </Template>
  );
};

export default BoardPage;
