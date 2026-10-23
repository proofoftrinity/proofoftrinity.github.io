import React, {useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';

import {ChevronLeftIcon, ChevronRightIcon, CloseIcon, ExpandIcon} from './icons';

// A horizontal drag at least this long switches screenshots on touch screens.
const SWIPE_PX = 40;

// Touch and pen swipes call onSwipe(1) for the next screenshot and onSwipe(-1)
// for the previous one. Mouse drags are ignored. `swiped` stays true until the
// next press, so the click that ends a swipe can be told apart from a tap.
function useSwipe(onSwipe) {
  const start = useRef(null);
  const swiped = useRef(false);
  const handlers = {
    onPointerDown: (event) => {
      swiped.current = false;
      start.current =
        event.pointerType === 'mouse' ? null : {x: event.clientX, y: event.clientY};
    },
    onPointerUp: (event) => {
      if (!start.current) return;
      const dx = event.clientX - start.current.x;
      const dy = event.clientY - start.current.y;
      start.current = null;
      if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
        swiped.current = true;
        onSwipe(dx < 0 ? 1 : -1);
      }
    },
    onPointerCancel: () => {
      start.current = null;
    },
  };
  return {handlers, swiped};
}

function Lightbox({shot, index, count, open, onStep, onClose, src}) {
  const dialog = useRef(null);
  const {handlers} = useSwipe(onStep);

  // The native modal dialog brings focus trapping, Esc to close, an inert
  // page behind it, and focus back on the opener when it closes.
  useEffect(() => {
    const node = dialog.current;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') onStep(1);
    if (event.key === 'ArrowLeft') onStep(-1);
  };

  return (
    <dialog
      ref={dialog}
      className="lightbox"
      aria-label={`${shot.label} screenshot, full size`}
      onClose={onClose}
      onKeyDown={onKeyDown}
      // A click on the dialog itself is a click on the dark area around the
      // screenshot.
      onClick={(event) => event.target === event.currentTarget && onClose()}>
      <button
        type="button"
        className="lightbox__button lightbox__close"
        aria-label="Close"
        onClick={onClose}>
        <CloseIcon />
      </button>
      <figure className="lightbox__figure" {...handlers}>
        <img
          src={src}
          alt={shot.alt}
          width="1280"
          height="832"
          loading="lazy"
          draggable={false}
        />
        <figcaption className="lightbox__caption">
          <span className="lightbox__count">
            {index + 1} / {count}
          </span>
          <span>
            <strong>{shot.label}.</strong> {shot.caption}
          </span>
        </figcaption>
      </figure>
      <button
        type="button"
        className="lightbox__button lightbox__nav lightbox__nav--prev"
        aria-label="Previous screenshot"
        onClick={() => onStep(-1)}>
        <ChevronLeftIcon />
      </button>
      <button
        type="button"
        className="lightbox__button lightbox__nav lightbox__nav--next"
        aria-label="Next screenshot"
        onClick={() => onStep(1)}>
        <ChevronRightIcon />
      </button>
    </dialog>
  );
}

// One large screenshot with a tab per screen above it. Clicking the
// screenshot opens it full size; arrows, swipes and the tabs move between
// them. Every image is in the static HTML, so search engines and visitors
// without JavaScript still get the first one and all the alt text.
export default function ScreenshotGallery({shots}) {
  const {withBaseUrl} = useBaseUrlUtils();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const tabs = useRef([]);
  const count = shots.length;
  const step = (delta) => setActive((current) => (current + delta + count) % count);
  const {handlers, swiped} = useSwipe(step);

  // Arrow keys, Home and End move between tabs and select as they go, as the
  // WAI-ARIA tabs pattern describes.
  const onTabKeyDown = (event) => {
    const targets = {ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: count - 1};
    if (!(event.key in targets)) return;
    event.preventDefault();
    const next = (targets[event.key] + count) % count;
    setActive(next);
    tabs.current[next]?.focus();
  };

  const shot = shots[active];

  return (
    <div className="gallery">
      <div className="segmented gallery__tabs" role="tablist" aria-label="Screenshots">
        {shots.map((item, index) => (
          <button
            key={item.src}
            ref={(node) => {
              tabs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`gallery-tab-${index}`}
            className="segmented__item"
            aria-selected={index === active}
            aria-controls="gallery-panel"
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={onTabKeyDown}>
            {item.label}
          </button>
        ))}
      </div>
      <div
        id="gallery-panel"
        className="gallery__stage"
        role="tabpanel"
        aria-labelledby={`gallery-tab-${active}`}
        {...handlers}>
        {shots.map((item, index) => (
          <img
            key={item.src}
            className={clsx('gallery__image', index === active && 'gallery__image--active')}
            src={withBaseUrl(item.src)}
            alt={item.alt}
            aria-hidden={index !== active}
            width="1280"
            height="832"
            loading={index === 0 ? 'eager' : 'lazy'}
            draggable={false}
          />
        ))}
        <button
          type="button"
          className="gallery__open"
          aria-label={`View the ${shot.label} screenshot full size`}
          onClick={() => !swiped.current && setOpen(true)}>
          <span className="gallery__hint" aria-hidden="true">
            <ExpandIcon />
          </span>
        </button>
      </div>
      <p className="gallery__caption">{shot.caption}</p>
      <Lightbox
        shot={shot}
        index={active}
        count={count}
        open={open}
        src={withBaseUrl(shot.src)}
        onStep={step}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
