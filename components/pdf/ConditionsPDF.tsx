"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Register Pretendard font
Font.register({
  family: "Pretendard",
  src: "/fonts/PretendardVariable.ttf",
  fonts: [
    {
      src: "/fonts/PretendardVariable.ttf",
      fontWeight: "normal",
    },
    {
      src: "/fonts/PretendardVariable.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Pretendard",
    fontSize: 10,
  },
  title: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 8,
  },
  heading: {
    fontSize: 11,
    marginTop: 8,
    marginBottom: 4,
    fontWeight: "bold",
  },
  text: {
    fontSize: 10,
    lineHeight: 1.4,
    marginBottom: 2,
  },
  signatureSection: {
    marginTop: 16,
    borderTop: "1 solid black",
    paddingTop: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  signatureImage: {
    width: 150,
    height: 75,
  },
  userName: {
    marginTop: 8,
    fontSize: 10,
    textAlign: "center",
  },
});

interface ConditionsPDFProps {
  signatureImage: string;
  userName: string;
}

export function ConditionsPDF({
  signatureImage,
  userName,
}: ConditionsPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>이용약관 동의서</Text>

        <View style={styles.section}>
          <Text style={styles.heading}>제1장 총 칙</Text>

          <Text style={styles.heading}>제1조(목적)</Text>
          <Text style={styles.text}>
            {`이 약관은 솔로사우나_레포(이하 "회사"라 한다) 홈페이지에서 제공하는
            모든 서비스(이하 "서비스"라 한다)의 이용조건 및 절차에 관한 사항을
            규정함을 목적으로 합니다.`}
          </Text>

          <Text style={styles.heading}>제2조(정의)</Text>
          <Text style={styles.text}>
            이 약관에서 사용하는 용어의 정의는 다음 각 호와 같습니다.
          </Text>
          <Text style={styles.text}>
            • 이용자 : 본 약관에 따라 회사가 제공하는 서비스를 받는 자
          </Text>
          <Text style={styles.text}>
            • 이용계약 : 서비스 이용과 관련하여 회사와 이용자간에 체결하는 계약
          </Text>
          <Text style={styles.text}>
            • 가입 : 회사가 제공하는 신청서 양식에 해당 정보를 기입하고, 본
            약관에 동의하여 서비스 이용계약을 완료시키는 행위
          </Text>
          <Text style={styles.text}>
            • 회원 : 당 사이트에 회원가입에 필요한 개인정보를 제공하여 회원
            등록을 한 자
          </Text>
          <Text style={styles.text}>
            • 이용자번호(ID) : 회원 식별과 회원의 서비스 이용을 위하여 이용자가
            선정하고 회사가 승인하는 영문자와 숫자의 조합
          </Text>
          <Text style={styles.text}>
            • 패스워드(PASSWORD) : 회원의 정보 보호를 위해 이용자 자신이 설정한
            영문자와 숫자, 특수문자의 조합
          </Text>
          <Text style={styles.text}>
            • 이용해지 : 회사 또는 회원이 서비스 이용이후 그 이용계약을
            종료시키는 의사표시
          </Text>

          <Text style={styles.heading}>제3조(약관의 효력과 변경)</Text>
          <Text style={styles.text}>
            회원은 변경된 약관에 동의하지 않을 경우 회원 탈퇴(해지)를 요청할 수
            있으며, 변경된 약관의 효력 발생일로부터 7일 이후에도 거부의사를
            표시하지 아니하고 서비스를 계속 사용할 경우 약관의 변경 사항에
            동의한 것으로 간주됩니다.
          </Text>

          <Text style={styles.heading}>제2장 서비스 이용계약</Text>

          <Text style={styles.heading}>제5조(이용계약의 성립)</Text>
          <Text style={styles.text}>
            이용계약은 이용자의 이용신청에 대한 회사의 승낙과 이용자의 약관
            내용에 대한 동의로 성립됩니다.
          </Text>

          <Text style={styles.heading}>제3장 계약당사자의 의무</Text>

          <Text style={styles.heading}>제9조(회사의 의무)</Text>
          <Text style={styles.text}>
            회사는 서비스 제공과 관련해서 알고 있는 회원의 신상 정보를 본인의
            승낙 없이 제3자에게 누설하거나 배포하지 않습니다.
          </Text>

          <Text style={styles.heading}>제10조(회원의 의무)</Text>
          <Text style={styles.text}>
            회원은 서비스를 이용할 때 다음 각 호의 행위를 하지 않아야 합니다.
          </Text>
          <Text style={styles.text}>
            • 다른 회원의 ID를 부정하게 사용하는 행위
          </Text>
          <Text style={styles.text}>
            • 서비스에서 얻은 정보를 복제, 출판 또는 제3자에게 제공하는 행위
          </Text>
          <Text style={styles.text}>
            • 회사의 저작권, 제3자의 저작권 등 기타 권리를 침해하는 행위
          </Text>
          <Text style={styles.text}>
            • 공공질서 및 미풍양속에 위반되는 내용을 유포하는 행위
          </Text>
          <Text style={styles.text}>
            • 범죄와 결부된다고 객관적으로 판단되는 행위
          </Text>
          <Text style={styles.text}>• 기타 관계법령에 위반되는 행위</Text>

          <Text style={styles.heading}>부 칙</Text>
          <Text style={styles.text}>
            (시행일) 이 약관은 2024년 1월 1일부터 시행합니다.
          </Text>
        </View>

        <View style={styles.signatureSection}>
          <Text style={styles.text}>
            위 약관에 동의하며, 아래 서명으로 이를 확인합니다.
          </Text>
          <Image style={styles.signatureImage} src={signatureImage} />
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </Page>
    </Document>
  );
}
