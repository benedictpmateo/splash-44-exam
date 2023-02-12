import React, { useState, useRef, useEffect } from "react";
import { Stage, Graphics, useTick, Text } from "@inlet/react-pixi";
import { Tween, Easing, update } from "@tweenjs/tween.js";
import { useIteration } from "@/hooks/useIteration";

const width = 500;
const height = 500;

const positionX = 50;
const positionY = 450;
const paddingL = 20;
const graphSize = 400;
const max = 10;
const step = graphSize / max;

const computeHeight = (count) => count * step;

const BarGraph = ({ items, players, secretGuess }) => {
  const barWidth = (positionY - positionX) / items.length;

  const [iter, setIter] = useIteration(1);
  const timeout = 200;

  useEffect(() => {
    setIter(1);
  }, [items]);

  return (
    <Stage
      width={width}
      height={height}
      raf={false}
      renderOnComponentChange={true}
      options={{ antialias: true, backgroundColor: 0xffffff }}
    >
      {items.map((value, index) => {
        const x = positionX + index * barWidth + paddingL;

        const y = positionY - computeHeight(value);

        const width = barWidth - 20;

        const height = computeHeight(value);

        const bar =
          iter > timeout
            ? { x, y, width, height }
            : {
                x,
                width,
                y: positionY - computeHeight(value) * (iter / timeout),
                height: computeHeight(value) * (iter / timeout),
              };

        return (
          <Graphics
            key={index}
            draw={(g) => {
              g.clear();
              g.beginFill(0xff9900);
              g.drawRect(bar.x, bar.y, bar.width, bar.height);
              g.endFill();
            }}
          />
        );
      })}

      <Graphics
        draw={(g) => {
          g.clear();
          g.lineStyle(2, 0x0, 1);
          g.moveTo(paddingL, positionY);
          g.lineTo(positionY, positionY);
        }}
      />

      <Graphics
        draw={(g) => {
          const move =
            iter > timeout + 200
              ? computeHeight(secretGuess)
              : iter > timeout
              ? computeHeight(secretGuess) *
                ((iter - (timeout + 200)) / timeout)
              : 0;

          g.clear();
          g.lineStyle(1, 0x023020, 1);
          g.moveTo(positionX, positionY - move);
          g.lineTo(positionY, positionY - move);
        }}
      />

      <Text
        x={positionY + 10}
        y={
          positionY -
          (iter > timeout + 200
            ? computeHeight(secretGuess)
            : iter > timeout
            ? computeHeight(secretGuess) * ((iter - (timeout + 200)) / timeout)
            : 0) - 7
        }
        style={{ fontSize: 12, color: 0x023020 }}
        text={secretGuess > 0 ? ((iter > timeout + 200) ? secretGuess : '') : ''}
      />
      <Text
        x={positionY + 2}
        y={
          positionY -
          (iter > timeout + 200
            ? computeHeight(secretGuess)
            : iter > timeout
            ? computeHeight(secretGuess) * ((iter - (timeout + 200)) / timeout)
            : 0) - 7 - 12
        }
        style={{ fontSize: 12, color: 0x023020 }}
        text={secretGuess > 0 ? ((iter > timeout + 200) ? 'Secret #' : '') : ''}
      />

      {players.map((player, index) => {
        const x = positionX + index * barWidth + paddingL;

        return (
          <Text
            text={player}
            x={x}
            y={470}
            style={{ fontSize: 10 }}
            rotation={0 * (Math.PI / 180)}
          />
        );
      })}
      {items.map((value, index) => {
        const x = positionX + index * barWidth + paddingL;

        return (
          <Text
            text={value}
            x={x}
            y={490}
            style={{ fontSize: 10 }}
            rotation={0 * (Math.PI / 180)}
          />
        );
      })}
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <Graphics
            key={i}
            draw={(g) => {
              g.clear();
              g.lineStyle(1, 0x0, 1);
              g.moveTo(positionX, positionY - computeHeight(i) - step);
              g.lineTo(positionY, positionY - computeHeight(i) - step);
            }}
          />
        ))}
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <Text
            key={i}
            text={i + 1}
            x={paddingL}
            y={positionY - computeHeight(i) - step - 7}
            style={{ fontSize: 12 }}
          />
        ))}
    </Stage>
  );
};

export default BarGraph;
