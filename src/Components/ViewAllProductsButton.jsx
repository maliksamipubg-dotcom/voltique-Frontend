import React from 'react'
import { Link } from 'react-router-dom'

// Centred "View All Products" CTA used at the end of a product grid.
// Self-contained on purpose: all styles are scoped under .vap-* so nothing in
// the shared stylesheet is touched. The animation only drives the outer glow's
// opacity/scale (compositor friendly) — the button itself never fades out.
const ViewAllProductsButton = () => {
  return (
    <>
      <style>{`
        .vap-wrap{
          position: relative;
          display: inline-block;
          border-radius: 9999px;
        }

        /* Ambient electric-blue glow: slow, subtle breathing pulse. */
        .vap-wrap::before{
          content: "";
          position: absolute;
          inset: -3px;
          border-radius: 9999px;
          pointer-events: none;
          box-shadow:
            0 0 0 4px rgba(22, 119, 255, 0.13),
            0 0 20px 3px rgba(32, 191, 239, 0.26),
            0 0 46px 8px rgba(22, 119, 255, 0.14);
          opacity: 0.5;
          will-change: opacity, transform;
          animation: vap-glow 3.8s ease-in-out infinite;
        }
        @keyframes vap-glow{
          0%, 100%{ opacity: 0.45; transform: scale(1); }
          50%{ opacity: 0.9; transform: scale(1.03); }
        }

        /* Hover layer: a slightly stronger glow that fades in, so the pulse
           itself never changes speed or visibility. */
        .vap-wrap::after{
          content: "";
          position: absolute;
          inset: -4px;
          border-radius: 9999px;
          pointer-events: none;
          box-shadow:
            0 0 0 5px rgba(22, 119, 255, 0.18),
            0 0 28px 6px rgba(32, 191, 239, 0.38),
            0 0 60px 14px rgba(22, 119, 255, 0.22);
          opacity: 0;
          will-change: opacity;
          transition: opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .vap-wrap:hover::after{
          opacity: 1;
        }

        .vap-btn{
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 9999px;
          padding: 0.9rem 2rem;
          font-size: 0.9375rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          line-height: 1.25rem;
          white-space: nowrap;
          text-decoration: none;
          color: #ffffff;
          background-image: linear-gradient(135deg, #1677ff 0%, #0e5fd8 58%, #1c74e4 100%);
          background-size: 160% 160%;
          background-position: 0% 50%;
          box-shadow:
            0 10px 24px -12px rgba(22, 119, 255, 0.85),
            inset 0 1px 0 rgba(255, 255, 255, 0.24);
          transition:
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            background-position 0.5s ease;
          -webkit-user-select: none;
          user-select: none;
          cursor: pointer;
        }
        .vap-btn:hover{
          transform: translateY(-3px);
          background-position: 100% 50%;
          box-shadow:
            0 18px 34px -14px rgba(22, 119, 255, 0.9),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .vap-arrow{
          display: inline-block;
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .vap-btn:hover .vap-arrow{
          transform: translateX(5px);
        }

        @media (max-width: 480px){
          .vap-btn{
            padding: 0.75rem 1.5rem;
            font-size: 0.875rem;
          }
          .vap-wrap::before,
          .vap-wrap::after{
            inset: -2px;
          }
        }

        @media (prefers-reduced-motion: reduce){
          .vap-wrap::before{
            animation: none;
          }
          .vap-btn,
          .vap-arrow{
            transition: none;
          }
          .vap-btn:hover{
            transform: none;
          }
        }
      `}</style>

      <span className="vap-wrap">
        <Link to='/collections' className="vap-btn">
          View All Products
          <span className="vap-arrow" aria-hidden="true">&#8594;</span>
        </Link>
      </span>
    </>
  )
}

export default ViewAllProductsButton
