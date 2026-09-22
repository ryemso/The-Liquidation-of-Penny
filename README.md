# The Liquidation of Penny

금융·주식 개념을 전투와 성장 시스템으로 변환한 **2D 횡스크롤 액션 로그라이트 브라우저 프로토타입**입니다.

[▶ Play Web Prototype](https://ryemso.github.io/The-Liquidation-of-Penny/)

## Project Snapshot

- **Genre**: 2D Side-scrolling Action Roguelite
- **Core Theme**: Penny Stock → Small Cap → Mid Cap → Blue Chip → Mega Cap → Market Legend
- **Scope**: 5개 장 × 장당 5개 방 = 총 25개 방
- **Core Systems**: 전투 · 대시 · 이단 점프 · 벽 이동 · 수직 탐험 · 차트 토템 · 선택형 엘리트 · 보상 교체
- **Analytics**: run/stage/reward/totem/combat event logging + 다중 플레이 로그 분석
- **Validation**: 자동 회귀 테스트를 지속 추가하며 시스템 변경을 검증

## Chapters

| Chapter | Theme | Progression |
|---|---|---|
| 1 | 잡주의 골목 | Small Cap |
| 2 | 기관의 벽 | Mid Cap |
| 3 | 알고리즘의 심장 | Blue Chip |
| 4 | 중앙은행 | Mega Cap |
| 5 | 시장 | Market Legend |

각 장은 일반 전투, 탐험 경로, 상점, 선택형 도전, 보스 전투를 조합합니다. 3·4·5장은 장별 전용 몬스터 아트를 사용하며, 최종장은 상승장·하락장·횡보장을 전투 패턴으로 각색했습니다.

## Core Gameplay

### Combat & Movement

- ← → 이동
- C 점프 / 이단 점프
- ↓ + C 얇은 발판 내려가기
- X 기본 3단 공격
- ↑ + X 위 공격 / 공중 ↓ + X 아래 공격
- Z 무적 대시
- 벽 슬라이드 / 벽 점프
- 공중 아래 공격 적중 시 반동 및 일부 공중 자원 회복

### Market Skills

- **A · 익절**
- **S · 레버리지**
- **D · 서킷브레이커**

금융 개념은 게임 플레이를 위한 전투 메커니즘으로 각색했으며 실제 투자 판단을 의미하지 않습니다.

## Chart Totems

차트 패턴을 전투 조건과 보상으로 변환한 **16종 토템 시스템**을 구현했습니다.

| Group | Totems |
|---|---|
| 추세 전환 | 이중 바닥·천장, 삼중 바닥·천장, 둥근 바닥·천장, 머리어깨형·역머리어깨형, 콰시모도 |
| 추세 지속 | 깃발형, 상승 쐐기, 하락 쐐기 |
| 중립 | 삼각수렴, 대칭 확산형 |
| 특수 | 컵앤핸들, 울프웨이브 |

최대 3종을 장착하며, 탐험 상자와 선택형 엘리트 보상에서 새 토템을 선택하거나 기존 장착과 비교해 교체할 수 있습니다.

## Exploration

전투만 반복하지 않도록 장별로:

- 하층 우회 경로
- 상층 이동 도전
- 숨겨진 보관함
- 연결교 지름길
- 선택형 엘리트 전투
- 수직 플랫폼과 벽 이동

을 배치했습니다.

일부 탐험방은 적 전멸이 아니라 **경로를 통과해 출구에 도달하는 것 자체**를 완료 조건으로 사용합니다.

## Play Analytics

`analytics.mjs`에서 도전 단위 로그를 기록합니다.

대표 이벤트:

`run_start`, `stage_start`, `stage_clear`, `stage_exit`, `enemy_encounter`, `enemy_defeated`, `attack`, `attack_hit`, `damage_taken`, `dodge_success`, `reward_presented`, `reward_selected`, `player_death`, `run_end`, 토템 발견·선택·장착·발동 이벤트 등.

로그는 서버로 전송하지 않고 브라우저에서 JSON으로 내보냅니다.

여러 플레이 로그를 합쳐 분석할 수 있습니다.

```sh
node scripts/analyze-runs.mjs session1.json session2.json > analysis.json
```

분석 결과에는 방별 완료/사망/미종료, 완료 시간, 토템 제시·선택·발동 횟수와 형성 실패 사유 등이 포함됩니다. 이는 수집된 플레이의 **기술 통계**이며 전체 사용자 행동이나 인과효과로 해석하지 않습니다.

## Run Locally

```sh
python -m http.server 8000
```

브라우저에서:

```text
http://localhost:8000
```

테스트:

```sh
node --test tests/*.test.mjs
```

## Validation Status

자동 테스트로 토템 효과, 상태 전이, 로그 연결, 이동/전투, 탐험 경로, 장 전환 등을 검증하고 있습니다.

다만 자동 테스트 통과가 실제 플레이 재미·난이도·가독성을 보장하지는 않습니다. 실제 사용자 플레이테스트와 밸런싱은 별도 검증 과제입니다.

## Documentation

- [Detailed Development Log](./docs/development-log.md) — 장별 확장, 안정화, 테스트 기록
- `totems.mjs` — 토템 조건·효과
- `analytics.mjs` — 플레이 이벤트 기록
- `scripts/analyze-runs.mjs` — 다중 플레이 로그 분석
- `tests/` — 회귀 테스트

## Why This Project

이 프로젝트는 게임 제작 자체뿐 아니라 **시스템 설계 → 구현 → 이벤트 로깅 → 반복 검증**을 한 흐름으로 연결하는 개인 프로토타입입니다.
